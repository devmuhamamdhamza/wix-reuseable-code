import wixSecretsBackend from 'wix-secrets-backend';
import { contacts, triggeredEmails } from 'wix-crm-backend';

export const getSecret = async (key) => {
    if (!key) return false
    const secretKey = await wixSecretsBackend.getSecret(key)
    return secretKey
}

export const createContact = async (email) => {
    const contactInfo = {
        name: {
            first: email.slice(0, email.lastIndexOf('@')),
            last: ""
        },
        emails: [{
            tag: "WORK",
            email
        }]
    };

    // const options = {
    //     allowDuplicates: false,
    //     suppressAuth: true
    // };

    return contacts.appendOrCreateContact(contactInfo)
        .then((contact) => {
            return {
                success: true,
                data: contact.contactId
            };
        })
        .catch((error) => {
            console.error(error);
            return error.message
        });
}

export const sendEmail = (emailId, contactId, options) => {
    return triggeredEmails.emailContact(emailId, contactId, options)
        .then(() => {
            console.log('Email was sent to contact');
            return {
                "success": true,
                data: {
                    "message": "Email Sent Successffully"
                }
            }
        })
        .catch((error) => {
            console.log(error);
            return error.message
        });
}
