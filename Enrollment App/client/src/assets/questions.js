// Import audio files at the top
import welcomeAudio from '../assets/audios/پنشنر ویریفیکیشن سسٹم میں آپ کو خوش آمدید.wav';
import nameAudio from '../assets/audios/اپکانامکیاہے.wav';
import bankAudio from '../assets/audios/آپ کس بینک سے پینشن لیتے ہیں؟.wav';
import cityAudio from '../assets/audios/آپ کس شہر سے تعلق رکھتے ہیں؟.wav';
import dobAudio from '../assets/audios/اپکیتاریخپیدائشکیاہے.wav';
import cnicAudio from '../assets/audios/آپ کا شناختی کارڈ نمبر کیا ہے؟.wav';
import ageAudio from '../assets/audios/آپ کی عمر کتنی ہے؟.wav';
import siblingsAudio from '../assets/audios/اپنے بہن بھائیوں کے بارے میں بتائیں۔.wav'
import poiliticianAudio from '../assets/audios/سیاست دان کون پسند ہے اور کیوں؟.wav'
import journeyAudio from '../assets/audios/اپنے پسندیدہ سفر کے بارے میں بتائیں۔.wav'
import countryAduio from '../assets/audios/آج کل کے ملکی حالات کے بارے میں باتیں.wav'
import hobbyAudio from '../assets/audios/اپنا پسندیدہ مشغلہ بتائیں اور اس کے فائدے بتائیں۔.wav'

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
    {
        text: 'اپنے بہن بھائیوں کے بارے میں بتائیں۔',
        file: siblingsAudio,
    },
    {
        text: 'سیاست دان کون پسند ہے اور کیوں؟',
        file: poiliticianAudio,
    },
    {
        text: 'اپنے پسندیدہ سفر کے بارے میں بتائیں۔',
        file: journeyAudio,
    },
    {
        text: 'آج کل کے ملکی حالات کے بارے میں بتائیں۔',
        file: countryAduio,
    },
    {
        text: 'اپنا پسندیدہ مشغلہ بتائیں اور اس کے فائدے بتائیں۔',
        file: hobbyAudio,
    },
    
];

export default questions;
