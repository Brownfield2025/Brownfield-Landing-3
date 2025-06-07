"use server"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  service: string
  message: string
}

export async function submitQuoteRequest(formData: FormData) {
  try {
    // Email to sales team
    const salesEmailContent = `
New Quote Request Received

Customer Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Service Needed: ${formData.service}

Message:
${formData.message}

Please follow up with this customer as soon as possible.

Best regards,
Brownfield Website System
    `.trim()

    // Email to customer
    const customerEmailContent = `
Dear ${formData.firstName} ${formData.lastName},

Thank you for your interest in Brownfield General Maintenance & Properties Management services.

We have received your quote request for: ${formData.service}

Our sales team will review your requirements and contact you within 24 hours to discuss your needs and provide you with a detailed quote.

If you have any urgent questions, please don't hesitate to call us at +971 5 655877.

Best regards,
Brownfield Sales Team
sales@brownfield.ae

---
Brownfield General Maintenance & Properties Management LLC
Office 103, Al Ain Tower, Hamdan St, Abu Dhabi
Phone: +971 5 655877
Email: info@brownfield.ae
    `.trim()

    // In a real implementation, you would use an email service like Resend, SendGrid, or similar
    // For demonstration purposes, we'll simulate the email sending

    // Simulate API call to email service
    const salesEmailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "sales@brownfield.ae",
        subject: `New Quote Request from ${formData.firstName} ${formData.lastName}`,
        text: salesEmailContent,
      }),
    })

    const customerEmailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: formData.email,
        subject: "Quote Request Received - Brownfield General Maintenance",
        text: customerEmailContent,
      }),
    })

    if (!salesEmailResponse.ok || !customerEmailResponse.ok) {
      throw new Error("Failed to send emails")
    }

    return { success: true, message: "Quote request submitted successfully!" }
  } catch (error) {
    console.error("Error submitting quote request:", error)
    return { success: false, message: "Failed to submit quote request. Please try again." }
  }
}
