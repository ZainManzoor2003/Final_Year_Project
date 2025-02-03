const getQuestions = (name, age, city, cnic, pensionBank) => {
    return [
        {
            text: 'پنشنر ویریفیکیشن سسٹم میں آپ کو خوش آمدید',
            file: require('../assets/audios/1.wav')
        },
        {
            text: 'آپ کا نام کیا ہے؟',
            file: require('../assets/audios/2.wav'),
            possibleAnswer: `${name}` // Dynamically insert the name
        },
        {
            text: 'آپ کس بینک سے پینشن لیتے ہیں؟',
            file: require('../assets/audios/3.wav'),
            possibleAnswer: `${pensionBank}`
        },
        {
            text: 'آپ کس شہر سے تعلق رکھتے ہیں؟',
            file: require('../assets/audios/4.wav'),
            possibleAnswer: `${city}`
        },
        {
            text: 'آپ کی تاریخ پیدائش کیا ہے؟',
            file: require('../assets/audios/5.wav'),
            possibleAnswer: `میری تاریخ پیدائش 5 مئی 2003 ہے۔`
        },
        {
            text: 'آپ کا شناختی کارڈ نمبر کیا ہے؟',
            file: require('../assets/audios/6.wav'),
            possibleAnswer: `${cnic}`
        },
        {
            text: 'آپ کی عمر کتنی ہے؟',
            file: require('../assets/audios/7.wav'),
            possibleAnswer: `${age}`
        },
    ];
};

export default getQuestions;
