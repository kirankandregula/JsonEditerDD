export async function sendMail() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const subject = document.getElementById("subject").value;
    const body = document.getElementById("body").value;
    const attachment = document.getElementById("attachment").files[0];

    const formData = new FormData();
    formData.append("from", from);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);
    if (attachment) {
        formData.append("attachment", attachment);
    }

    try {
        const response = await fetch('/api/sendMail', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert('Mail sent successfully.');
        } else {
            alert('Failed to send mail.');
        }
    } catch (error) {
        console.error('Error sending mail:', error);
        alert('Failed to send mail.');
    }
}
