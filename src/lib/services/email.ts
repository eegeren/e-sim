import nodemailer from "nodemailer";
import { androidSteps, iphoneSteps } from "@/lib/content";
import { formatPrice } from "@/lib/pricing";
import { logError, logInfo } from "@/lib/logger";

export type EmailSendResult = {
  delivered: boolean;
  preview: string;
};

type EmailOrder = {
  id: string;
  email: string;
  qrCodeUrl: string | null;
  activationCode: string | null;
  manualCode: string | null;
  currency: string;
  totalAmount: { toString(): string };
  package: {
    id: string;
    name: string;
    dataGb: { toString(): string };
    validityDays: number;
    country?: { name: string | null } | null;
    region?: { name: string | null } | null;
  };
};

type EmailDelivery = {
  qrCodeUrl: string | null;
  activationCode: string | null;
  manualCode: string | null;
  iccid: string | null;
  smdpAddress: string | null;
};

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function renderSteps(title: string, steps: string[]) {
  return `
    <div style="margin-top:16px;">
      <h3 style="font-size:16px;margin:0 0 8px;">${title}</h3>
      <ol style="padding-left:18px;margin:0;color:#475569;line-height:1.8;">
        ${steps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
    </div>
  `;
}

async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  logContext: Record<string, unknown>;
}) {
  const transport = getTransport();

  if (!transport) {
    logInfo("SMTP not configured. Logging email preview instead of sending.", input.logContext);
    return {
      delivered: false,
      preview: input.html,
    };
  }

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM ?? "esimQ <no-reply@esimq.test>",
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    return {
      delivered: true,
      preview: input.html,
    };
  } catch (error) {
    logError("Failed to send email", error, input.logContext);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(order: EmailOrder): Promise<EmailSendResult> {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fbff;padding:24px;color:#102033;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;padding:32px;border:1px solid rgba(15,23,42,0.08);">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#0369a1;">esimQ order confirmation</p>
        <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;">We received your payment</h1>
        <p style="margin:0 0 24px;color:#475569;line-height:1.7;">Your order for <strong>${order.package.name}</strong> is being provisioned now. We will send the QR code and activation details as soon as they are ready.</p>
        <div style="background:#f8fafc;border-radius:18px;padding:16px;">
          <p style="margin:0;color:#64748b;font-size:13px;">Order summary</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:1.8;color:#102033;">${order.package.country?.name ?? order.package.region?.name ?? "Global"} • ${order.package.dataGb.toString()} GB • ${order.package.validityDays} days</p>
          <p style="margin:6px 0 0;font-size:18px;font-weight:700;">${formatPrice(order.totalAmount.toString(), order.currency)}</p>
        </div>
        <div style="margin-top:24px;">
          <a href="${appUrl}/orders/${order.id}" style="display:inline-block;background:#0f172a;color:#fff;padding:14px 20px;border-radius:16px;text-decoration:none;font-weight:700;">View order</a>
        </div>
      </div>
    </div>
  `.trim();

  return sendEmail({
    to: order.email,
    subject: `esimQ order received: ${order.package.name}`,
    html,
    logContext: {
      orderId: order.id,
      email: order.email,
      type: "confirmation",
    },
  });
}

export async function sendOrderDeliveryEmail(input: {
  order: EmailOrder;
  delivery: EmailDelivery;
}): Promise<EmailSendResult> {
  const { order, delivery } = input;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const qrImage = delivery.qrCodeUrl
    ? `<img src="${delivery.qrCodeUrl}" alt="esimQ QR Code" width="220" height="260" style="display:block;border-radius:20px;background:#fff;padding:12px;" />`
    : "";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fbff;padding:24px;color:#102033;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;padding:32px;border:1px solid rgba(15,23,42,0.08);">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#0369a1;">esimQ eSIM delivery</p>
        <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;">Your ${order.package.name} plan is ready</h1>
        <p style="margin:0 0 24px;color:#475569;line-height:1.7;">Your QR code and manual activation details are ready below. Keep this email available during your trip in case you need to reinstall the line.</p>
        <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;">
          <div>${qrImage}</div>
          <div style="flex:1;min-width:240px;">
            <div style="background:#f8fafc;border-radius:18px;padding:16px;margin-bottom:12px;">
              <p style="margin:0;color:#64748b;font-size:13px;">Activation code</p>
              <p style="margin:6px 0 0;font-family:monospace;font-size:14px;word-break:break-all;">${delivery.activationCode ?? "-"}</p>
            </div>
            <div style="background:#f8fafc;border-radius:18px;padding:16px;margin-bottom:12px;">
              <p style="margin:0;color:#64748b;font-size:13px;">Manual code</p>
              <p style="margin:6px 0 0;font-family:monospace;font-size:14px;word-break:break-all;">${delivery.manualCode ?? "-"}</p>
            </div>
            <div style="background:#f8fafc;border-radius:18px;padding:16px;">
              <p style="margin:0;color:#64748b;font-size:13px;">Order total</p>
              <p style="margin:6px 0 0;font-size:18px;font-weight:700;">${formatPrice(order.totalAmount.toString(), order.currency)}</p>
            </div>
          </div>
        </div>
        <div style="margin-top:16px;background:#f8fafc;border-radius:18px;padding:16px;">
          <p style="margin:0;color:#64748b;font-size:13px;">Provisioning details</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:1.8;color:#102033;">Order ID: ${order.id}</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:1.8;color:#102033;">ICCID: ${delivery.iccid ?? "-"}</p>
          <p style="margin:6px 0 0;font-size:14px;line-height:1.8;color:#102033;">SM-DP+: ${delivery.smdpAddress ?? "-"}</p>
        </div>
        ${renderSteps("Install on iPhone", iphoneSteps)}
        ${renderSteps("Install on Android", androidSteps)}
        <div style="margin-top:24px;">
          <a href="${appUrl}/orders/${order.id}" style="display:inline-block;background:#0f172a;color:#fff;padding:14px 20px;border-radius:16px;text-decoration:none;font-weight:700;">View full order</a>
        </div>
      </div>
    </div>
  `.trim();

  return sendEmail({
    to: order.email,
    subject: `Your esimQ eSIM for ${order.package.country?.name ?? order.package.region?.name ?? "travel"} is ready`,
    html,
    logContext: {
      orderId: order.id,
      email: order.email,
      type: "delivery",
    },
  });
}
