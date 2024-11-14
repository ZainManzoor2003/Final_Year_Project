// Import audio files at the top
import welcomeAudio from '../assets/audios/ٹینشنویریفیکیشنسسٹممیںاپکوخوشامدید.wav';
import nameAudio from '../assets/audios/اپکانامکیاہے.wav';
import bankAudio from '../assets/audios/اپکسبینکسےپینشنلیتےہیں.wav';
import cityAudio from '../assets/audios/اپکسشہرسےتعلقرکھتےہیں.wav';
import dobAudio from '../assets/audios/اپکیتاریخپیدائشکیاہے.wav';
import cnicAudio from '../assets/audios/اپکاشناختیکارڈنمبرکیاہے.wav';
import ageAudio from '../assets/audios/اپکیعمرکتنیہے.wav';

// Define the questions array
const questions = [
    {
        text: 'پنشنر ویریفیکیشن سسٹم میں آپ کو خوش آمدید',
        file: welcomeAudio,
    },
    {
        text: 'آپ کا نام کیا ہے؟',
        file: nameAudio,
    },
    {
        text: 'آپ کس بینک سے پینشن لیتے ہیں؟',
        file: bankAudio,
    },
    {
        text: 'آپ کس شہر سے تعلق رکھتے ہیں؟',
        file: cityAudio,
    },
    {
        text: 'آپ کی تاریخ پیدائش کیا ہے؟',
        file: dobAudio,
    },
    {
        text: 'آپ کا شناختی کارڈ نمبر کیا ہے؟',
        file: cnicAudio,
    },
    {
        text: 'آپ کی عمر کتنی ہے؟',
        file: ageAudio,
    },
];

export default questions;
