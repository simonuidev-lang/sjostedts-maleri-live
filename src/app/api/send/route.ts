import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, adress, message } = body;

    /* Swedish timestamp — reliable, always in Europe/Stockholm timezone */
    const timestamp = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });

    const html = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ny Offertförfrågan</title>
</head>
<body style="margin:0;padding:0;background:#f4f0ea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.12);">
    <!-- Header -->
    <div style="background:#000000;padding:40px 40px 32px;">
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.45);font-size:10px;letter-spacing:0.28em;text-transform:uppercase;font-weight:600;">Sjöstedts Måleri</p>
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;line-height:1.2;">Ny Offertförfrågan</h1>
      <p style="margin:12px 0 0;color:rgba(255,255,255,0.4);font-size:12px;letter-spacing:0.08em;">${timestamp}</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <!-- Contact details -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;width:38%;">
            <span style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.38);font-weight:600;">Namn</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <span style="font-size:15px;font-weight:600;color:#111;">${name || "—"}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <span style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.38);font-weight:600;">Telefon</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <a href="tel:${phone || ""}" style="font-size:15px;font-weight:600;color:#000;text-decoration:none;">${phone || "—"}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <span style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.38);font-weight:600;">E-post</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <a href="mailto:${email || ""}" style="font-size:15px;font-weight:600;color:#000;text-decoration:none;">${email || "—"}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <span style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.38);font-weight:600;">Adress</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #f0ece6;vertical-align:top;">
            <span style="font-size:15px;font-weight:600;color:#111;">${adress || "—"}</span>
          </td>
        </tr>
      </table>

      <!-- Message -->
      ${
        message
          ? `
      <div style="margin-bottom:28px;">
        <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.38);font-weight:600;">Projektbeskrivning</p>
        <div style="background:#f7f4ef;border-radius:14px;padding:20px 22px;">
          <p style="margin:0;font-size:15px;color:#333;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</p>
        </div>
      </div>`
          : ""
      }

      <!-- CTA -->
      <div style="text-align:center;padding:10px 0 0;">
        <a href="tel:${phone || ""}" style="display:inline-block;padding:16px 36px;background:#000;color:#fff;border-radius:9999px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">
          Ring tillbaka
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#faf7f2;padding:24px 40px;border-top:1px solid #f0ece6;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(0,0,0,0.3);letter-spacing:0.12em;">
        © ${new Date().getFullYear()} Sjöstedts Måleri AB &middot; Automatisk notis från hemsidan
      </p>
    </div>
  </div>
</body>
</html>`;

    /* ── Send email using Resend client directly ── */
    await resend.emails.send({
      from: "Sjöstedts Måleri <onboarding@resend.dev>",
      to: "krigaren109@gmail.com",
      replyTo: email || undefined,
      subject: `🎨 Ny offertförfrågan från ${name || "okänd"} — ${timestamp}`,
      html,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[send/route] Error:", err);
    return Response.json({ ok: false, error: "Kunde inte skicka e-post." }, { status: 500 });
  }
}
