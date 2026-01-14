const FAQ = require('../models/FAQ');

const defaultFAQs = [
  // General Category
  {
    question: 'What services does A S Gupta & Co provide?',
    answer: 'We provide comprehensive services including Income Tax Filing, GST Registration & Returns, Company Registration, Audit & Assurance, Bookkeeping, TDS Compliance, Business Advisory, and Financial Planning services for individuals and businesses.',
    category: 'General',
    order: 1,
    isActive: true
  },
  {
    question: 'What are your office working hours?',
    answer: 'Our office is open Monday to Saturday from 10:00 AM to 7:00 PM. We are closed on Sundays and public holidays. You can also schedule appointments outside regular hours for urgent matters.',
    category: 'General',
    order: 2,
    isActive: true
  },
  {
    question: 'Do you provide services for individuals or only businesses?',
    answer: 'We serve both individuals and businesses. For individuals, we offer income tax filing, tax planning, and financial advisory. For businesses, we provide complete accounting, GST, audit, company registration, and compliance services.',
    category: 'General',
    order: 3,
    isActive: true
  },
  {
    question: 'How can I schedule a consultation?',
    answer: 'You can schedule a consultation by calling us, sending an email, or filling out the contact form on our website. We offer both in-person meetings at our Zirakpur office and virtual consultations via video call.',
    category: 'General',
    order: 4,
    isActive: true
  },

  // Income Tax Category
  {
    question: 'What is the due date for filing Income Tax Return?',
    answer: 'For individuals and non-audit cases, the due date is usually July 31st. For businesses requiring audit, it is October 31st. For transfer pricing cases, it is November 30th. These dates may be extended by the government.',
    category: 'Income Tax',
    order: 1,
    isActive: true
  },
  {
    question: 'What documents are required for ITR filing?',
    answer: 'You need PAN Card, Aadhaar Card, Form 16 (for salaried), Bank Statements, Investment Proofs (80C, 80D), Capital Gains statements, Rental Income details, and any other income documents. We will guide you through the complete list based on your specific case.',
    category: 'Income Tax',
    order: 2,
    isActive: true
  },
  {
    question: 'Can I file a revised return if I made a mistake?',
    answer: 'Yes, you can file a revised return before the end of the relevant assessment year or before the completion of assessment, whichever is earlier. We can help you identify errors and file the revised return correctly.',
    category: 'Income Tax',
    order: 3,
    isActive: true
  },
  {
    question: 'What are the penalties for late filing of ITR?',
    answer: 'Late filing attracts a penalty of Rs. 5,000 if filed after due date but before December 31st, and Rs. 10,000 if filed after December 31st. For taxpayers with income below Rs. 5 lakh, the maximum penalty is Rs. 1,000.',
    category: 'Income Tax',
    order: 4,
    isActive: true
  },

  // GST Category
  {
    question: 'When is GST registration mandatory?',
    answer: 'GST registration is mandatory if your annual turnover exceeds Rs. 40 lakh (Rs. 20 lakh for special category states) for goods, or Rs. 20 lakh (Rs. 10 lakh for special category states) for services. It is also mandatory for inter-state suppliers and e-commerce operators.',
    category: 'GST',
    order: 1,
    isActive: true
  },
  {
    question: 'What are the due dates for GST return filing?',
    answer: 'GSTR-1 is due by 11th of next month, GSTR-3B by 20th of next month. Quarterly filers under QRMP scheme file GSTR-1 by 13th of month following the quarter. Annual return GSTR-9 is due by December 31st.',
    category: 'GST',
    order: 2,
    isActive: true
  },
  {
    question: 'What is Input Tax Credit (ITC) and how to claim it?',
    answer: 'ITC allows you to reduce the tax you have already paid on inputs from the tax payable on output. To claim ITC, you must have a valid tax invoice, receive goods/services, file returns, and the supplier must have deposited the tax.',
    category: 'GST',
    order: 3,
    isActive: true
  },
  {
    question: 'What are the penalties for non-filing of GST returns?',
    answer: 'Late fee is Rs. 50 per day (Rs. 25 CGST + Rs. 25 SGST) for regular returns, subject to a maximum. For nil returns, it is Rs. 20 per day. Interest at 18% per annum is also charged on outstanding tax liability.',
    category: 'GST',
    order: 4,
    isActive: true
  },

  // Company & Startup Category
  {
    question: 'What is the process for company registration?',
    answer: 'The process includes: 1) Obtain DSC and DIN for directors, 2) Reserve company name via RUN, 3) Draft MOA and AOA, 4) File SPICe+ form with MCA, 5) Obtain Certificate of Incorporation. We handle the entire process and it typically takes 7-10 working days.',
    category: 'Company & Startup',
    order: 1,
    isActive: true
  },
  {
    question: 'What is the minimum capital required to start a Private Limited Company?',
    answer: 'There is no minimum paid-up capital requirement for Private Limited Companies in India. You can start with any amount of capital. However, we recommend having adequate capital based on your business requirements.',
    category: 'Company & Startup',
    order: 2,
    isActive: true
  },
  {
    question: 'What are the compliance requirements for a Private Limited Company?',
    answer: 'Annual compliances include filing Annual Return (MGT-7), Financial Statements (AOC-4), Income Tax Return, conducting AGM, maintaining statutory registers, and board meetings. We provide complete compliance management services.',
    category: 'Company & Startup',
    order: 3,
    isActive: true
  },
  {
    question: 'How can I register my startup under Startup India?',
    answer: 'To register under Startup India, your entity should be incorporated as Private Limited, LLP, or Partnership, be less than 10 years old, have turnover below Rs. 100 crore, and work towards innovation. We help with DPIIT recognition and benefits like tax exemptions.',
    category: 'Company & Startup',
    order: 4,
    isActive: true
  },

  // Audit & Accounting Category
  {
    question: 'When is a tax audit required?',
    answer: 'Tax audit under Section 44AB is required if business turnover exceeds Rs. 1 crore (Rs. 10 crore if cash transactions are less than 5%), or professional receipts exceed Rs. 50 lakh, or if claiming lower profits under presumptive taxation.',
    category: 'Audit & Accounting',
    order: 1,
    isActive: true
  },
  {
    question: 'What is the difference between bookkeeping and accounting?',
    answer: 'Bookkeeping involves recording daily financial transactions like sales, purchases, receipts, and payments. Accounting is broader and includes analyzing, interpreting, and summarizing financial data to prepare financial statements and support business decisions.',
    category: 'Audit & Accounting',
    order: 2,
    isActive: true
  },
  {
    question: 'Do you provide virtual/cloud accounting services?',
    answer: 'Yes, we offer cloud-based accounting services using leading software like Tally, Zoho Books, and QuickBooks. This allows real-time access to your financial data, automatic backups, and seamless collaboration.',
    category: 'Audit & Accounting',
    order: 3,
    isActive: true
  },
  {
    question: 'What reports will I receive from your accounting services?',
    answer: 'You will receive monthly/quarterly financial statements including Profit & Loss Account, Balance Sheet, Cash Flow Statement, Bank Reconciliation, Accounts Receivable/Payable aging reports, and customized MIS reports as per your requirements.',
    category: 'Audit & Accounting',
    order: 4,
    isActive: true
  }
];

const seedFAQs = async () => {
  try {
    // Check if FAQs already exist
    const existingCount = await FAQ.countDocuments();

    if (existingCount > 0) {
      console.log(`FAQs already exist (${existingCount} found). Skipping seed.`);
      return { success: true, message: 'FAQs already exist', count: existingCount };
    }

    // Insert default FAQs
    const result = await FAQ.insertMany(defaultFAQs);
    console.log(`Successfully seeded ${result.length} FAQs`);

    return { success: true, message: 'FAQs seeded successfully', count: result.length };
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    throw error;
  }
};

module.exports = { seedFAQs, defaultFAQs };
