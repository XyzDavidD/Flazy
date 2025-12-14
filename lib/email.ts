import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface AdminNotificationPayload {
  submissionId: string
  name: string
  email: string
  prompt: string
  allowPublic: boolean
  videoUrl: string
}

export async function sendAdminNotification(payload: AdminNotificationPayload) {
  try {
    const { submissionId, name, email, prompt, allowPublic, videoUrl } = payload

    const { data, error } = await resend.emails.send({
      from: 'FLAZY <onboarding@resend.dev>',
      to: process.env.ADMIN_NOTIFICATION_EMAIL || '',
      subject: 'Nouvelle commande FLAZY (payée)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h2 style="color: #ff8a1f; margin-bottom: 20px;">Nouvelle commande FLAZY (payée)</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #020314; margin-top: 0;">Informations de la commande</h3>
            <p><strong>ID de soumission:</strong> ${submissionId}</p>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Autorisation publique:</strong> ${allowPublic ? 'Oui' : 'Non'}</p>
          </div>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #020314; margin-top: 0;">Description de la vidéo</h3>
            <p style="white-space: pre-wrap; color: #64748b;">${prompt}</p>
          </div>

          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #020314; margin-top: 0;">Lien de la vidéo</h3>
            <p><a href="${videoUrl}" style="color: #ff8a1f; word-break: break-all;">${videoUrl}</a></p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend email error:', error)
      throw error
    }

    console.log('Admin notification email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    throw error
  }
}


