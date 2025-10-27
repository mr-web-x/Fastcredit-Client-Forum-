"use client"

import "./ExpertContacts.scss";
import {
    Language as LanguageIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Share as ShareIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    LinkedIn as LinkedInIcon,
    WhatsApp as WhatsAppIcon,
    Telegram as TelegramIcon
} from "@mui/icons-material";

const ExpertContacts = ({ contacts }) => {
    if (!contacts) return null;

    const getSocialIcon = (url) => {
        const lowerUrl = url.toLowerCase();

        if (lowerUrl.includes('instagram') || lowerUrl.includes('instagram')) {
            return <InstagramIcon fontSize="small" />;
        } else if (lowerUrl.includes('facebook') || lowerUrl.includes('fb.com')) {
            return <FacebookIcon fontSize="small" />;
        } else if (lowerUrl.includes('linkedin')) {
            return <LinkedInIcon fontSize="small" />;
        } else if (lowerUrl.includes('whatsapp') || lowerUrl.includes('wa.me')) {
            return <WhatsAppIcon fontSize="small" />;
        } else if (lowerUrl.includes('telegram') || lowerUrl.includes('t.me')) {
            return <TelegramIcon fontSize="small" />;
        } else {
            return <ShareIcon fontSize="small" />;
        }
    };


    return (
        <div className="expert-contacts">
            <h4 className="expert-contacts-title">Kontakt experta</h4>
            <div className="expert-contacts-list">
                {contacts?.website && (
                    <a
                        href={contacts.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="expert-contact-link"
                    >
                        <LanguageIcon fontSize="small" />
                        <span>{contacts.website.length > 30 ? contacts.website.substring(0, 27) + "..." : contacts.website}</span>
                    </a>
                )}
                {contacts?.email && (
                    <a
                        href={`mailto:${contacts.email}`}
                        className="expert-contact-link"
                    >
                        <EmailIcon fontSize="small" />
                        <span>{contacts.email}</span>
                    </a>
                )}
                {contacts?.phone && (
                    <a
                        href={`tel:${contacts.phone}`}
                        className="expert-contact-link"
                    >
                        <PhoneIcon fontSize="small" />
                        <span>{contacts.phone}</span>
                    </a>
                )}


                {/* Социальные сети */}
                {contacts?.socials &&
                    contacts.socials.length > 0 &&
                    Array.isArray(contacts.socials) &&
                    contacts.socials.map((social, index) => (
                        <a
                            key={index}
                            href={social}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="expert-contact-link"
                        >
                            {getSocialIcon(social)}
                            <span>{social.length > 30 ? social.substring(0, 27) + "..." : social}</span>
                        </a>
                    ))}
            </div>
        </div>
    );
};

export default ExpertContacts;