const Service = require('../models/Service');
const https = require('https');
const http = require('http');

// Helper function to fetch image and convert to base64
const fetchImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        fetchImageAsBase64(response.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = response.headers['content-type'] || 'image/jpeg';
        resolve({
          data: buffer.toString('base64'),
          contentType
        });
      });
      response.on('error', reject);
    }).on('error', reject);
  });
};

// Professional images from Pexels for each service category
const getServiceImages = async (category, count = 2) => {
  const images = [];
  const baseUrls = {
    'international-taxation': [
      'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'gst': [
      'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'registration': [
      'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'audit': [
      'https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5849569/pexels-photo-5849569.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'accounting': [
      'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5849592/pexels-photo-5849592.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'tax-consultancy': [
      'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6863244/pexels-photo-6863244.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'company-secretarial': [
      'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'advisory': [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  };

  const urls = baseUrls[category] || baseUrls['advisory'];

  for (let i = 0; i < Math.min(count, urls.length); i++) {
    try {
      const image = await fetchImageAsBase64(urls[i]);
      images.push(image);
    } catch (error) {
      console.log(`Failed to fetch image: ${error.message}`);
    }
  }

  return images;
};

const servicesData = [
  {
    title: 'International Taxation',
    shortDescription: 'Comprehensive international taxation services for multinational corporations, global enterprises, and NRIs navigating cross-border tax compliance and strategic planning.',
    icon: 'Globe',
    order: 1,
    imageCategory: 'international-taxation',
    content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">International Taxation Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">In today's interconnected global economy, businesses and individuals face increasingly complex <strong>international tax challenges</strong>. At <mark style="background-color: #dbeafe; padding: 2px 6px;">A S Gupta & Co</mark>, we deliver <strong>world-class international taxation services</strong> in India, empowering <em>multinational corporations</em>, <em>global enterprises</em>, <em>cross-border investors</em>, and <em>high-net-worth individuals</em> to master the complexities of global tax compliance, cross-border taxation, and strategic international tax planning.</p>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our firm has established itself as a <strong>leading authority</strong> in international taxation matters, serving clients across <u>manufacturing</u>, <u>technology</u>, <u>pharmaceuticals</u>, <u>financial services</u>, and <u>e-commerce sectors</u>. We understand that each cross-border transaction carries unique tax implications, and our tailored approach ensures optimal outcomes for every client.</p>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🌐 Our Expertise in Global Tax Matters</h3>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Our team of <strong>seasoned tax professionals</strong> brings <mark style="background-color: #fef3c7; padding: 2px 6px;">decades of combined experience</mark> in navigating the intricate landscape of international tax laws across multiple jurisdictions. We stay at the forefront of regulatory changes, including amendments to <strong>DTAA provisions</strong>, <strong>BEPS (Base Erosion and Profit Shifting)</strong> guidelines, and evolving <strong>transfer pricing regulations</strong> to ensure our clients remain compliant while optimizing their global tax positions.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">International taxation involves understanding and applying tax rules that govern income, profits, and transactions crossing national boundaries. This includes:</p>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;">Determining <strong>taxable presence</strong> (Permanent Establishment) in foreign jurisdictions</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Understanding <strong>source vs. residence-based taxation</strong> principles</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Leveraging <strong>treaty benefits</strong> effectively under applicable DTAAs</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Managing <strong>withholding tax obligations</strong> on cross-border payments</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Ensuring compliance with <strong>FEMA regulations</strong> and RBI guidelines</li>
</ul>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📋 Key Service Areas</h3>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1e40af; margin-bottom: 10px;">✦ Cross-Border Transaction Structuring</h4>
<p style="line-height: 1.7;">Expert guidance on structuring international transactions including <strong>mergers</strong>, <strong>acquisitions</strong>, <strong>joint ventures</strong>, and <strong>business reorganizations</strong> to minimize tax exposure while maintaining full compliance with local and international regulations. We analyze the tax implications across all jurisdictions involved and recommend structures that optimize overall tax efficiency.</p>
</div>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #10b981;">
<h4 style="color: #065f46; margin-bottom: 10px;">✦ Transfer Pricing Services</h4>
<p style="line-height: 1.7;">Comprehensive <strong>transfer pricing documentation</strong>, benchmarking studies using reliable databases like <em>PROWESS</em> and <em>Capitaline</em>, policy formulation, and dispute resolution services aligned with <strong>Indian regulations (Sections 92-92F)</strong> and <strong>OECD guidelines</strong>. We help multinational enterprises defend their intercompany pricing before tax authorities.</p>
</div>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
<h4 style="color: #b45309; margin-bottom: 10px;">✦ Treaty Planning & DTAA</h4>
<p style="line-height: 1.7;">Strategic utilization of India's extensive network of <strong>Double Taxation Avoidance Agreements</strong> with <mark style="background-color: #fef3c7; padding: 2px 6px;">90+ countries</mark> to optimize withholding taxes, prevent double taxation, and secure treaty benefits. We analyze <strong>MFN clauses</strong>, <strong>Limitation of Benefits (LOB)</strong> provisions, and <strong>Principal Purpose Test (PPT)</strong> implications.</p>
</div>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #8b5cf6;">
<h4 style="color: #6d28d9; margin-bottom: 10px;">✦ Permanent Establishment Analysis</h4>
<p style="line-height: 1.7;">Thorough assessment of <strong>PE risks</strong> for businesses operating across borders, including <em>fixed place PE</em>, <em>service PE</em>, <em>construction PE</em>, and <em>agency PE</em>. We develop strategies to mitigate unintended PE exposure while ensuring legitimate business activities can continue without adverse tax consequences.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🎯 Why Choose Us for International Taxation?</h3>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">We combine <strong>deep technical expertise</strong> with <strong>practical business acumen</strong> to deliver solutions that work in the real world. Our collaborative approach ensures that tax planning aligns with your overall business strategy and objectives. We understand that international tax planning is not just about compliance—it's about <mark style="background-color: #dcfce7; padding: 2px 6px;">creating value and competitive advantage</mark> for your business.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Our clients benefit from:</p>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 8px; line-height: 1.7;"><strong>Proactive approach</strong> to identifying tax-saving opportunities before they're missed</li>
<li style="margin-bottom: 8px; line-height: 1.7;"><strong>Extensive experience</strong> in handling complex multi-jurisdictional matters</li>
<li style="margin-bottom: 8px; line-height: 1.7;"><strong>Commitment to staying ahead</strong> of regulatory developments and treaty amendments</li>
<li style="margin-bottom: 8px; line-height: 1.7;"><strong>Strong relationships</strong> with tax authorities for effective dispute resolution</li>
<li style="margin-bottom: 8px; line-height: 1.7;"><strong>Global network</strong> of professional contacts for seamless cross-border coordination</li>
</ul>

<p style="font-size: 16px; line-height: 1.8; background-color: #eff6ff; padding: 15px; border-radius: 8px;">Whether you're <strong>expanding internationally</strong>, <strong>restructuring global operations</strong>, or <strong>dealing with tax authority inquiries</strong>, our team provides the expertise you need. Contact us today for a confidential consultation on your international tax matters.</p>`,
    subServices: [
      {
        title: 'International Taxation Advisory',
        shortDescription: 'Holistic, forward-looking guidance on every facet of cross-border tax implications for businesses and individuals.',
        order: 1,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">International Taxation Advisory</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our <strong>international taxation advisory services</strong> offer <mark style="background-color: #dbeafe; padding: 2px 6px;">holistic, forward-looking guidance</mark> on every facet of cross-border tax implications, including <strong>foreign income characterization</strong>, <strong>overseas investment structuring</strong>, <strong>repatriation strategies</strong>, <strong>expatriate taxation</strong>, and <strong>multinational operational planning</strong>. We help clients navigate the complex intersection of domestic tax laws and international tax treaties.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">In an era of increasing <em>global tax transparency</em> and <em>information exchange</em>, businesses need advisors who understand not just the letter of the law, but its practical application across jurisdictions. Our team combines <strong>technical excellence</strong> with <strong>commercial awareness</strong> to deliver advice that drives real value.</p>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📜 Comprehensive Advisory Services</h3>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">We excel in interpreting and applying <strong>Double Taxation Avoidance Agreements (DTAA)</strong> that India has signed with over <mark style="background-color: #fef3c7; padding: 2px 6px;">90 countries</mark>. Our expertise covers:</p>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;">Analyzing <strong>treaty benefits</strong> such as reduced withholding rates on <em>dividends</em>, <em>interest</em>, <em>royalties</em>, and <em>fees for technical services (FTS)</em></li>
<li style="margin-bottom: 10px; line-height: 1.7;">Advising on <strong>foreign tax credits</strong> and avoiding double taxation scenarios</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Applying <strong>tie-breaker rules</strong> for dual residency situations under Article 4</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Leveraging <strong>Most Favored Nation (MFN)</strong> clauses to access better treaty rates</li>
<li style="margin-bottom: 10px; line-height: 1.7;">Navigating <strong>Multilateral Instrument (MLI)</strong> modifications to existing treaties</li>
</ul>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🎯 Areas of Expertise</h3>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #0284c7;">
<h4 style="color: #0369a1; margin-bottom: 10px;">✦ Cross-Border Income Analysis</h4>
<p style="line-height: 1.7; margin-bottom: 10px;">Detailed analysis of <strong>income characterization</strong> under various treaties—determining whether payments constitute:</p>
<ul style="padding-left: 20px;">
<li><strong>Business Profits</strong> (Article 7) - taxable only if PE exists</li>
<li><strong>Royalties</strong> (Article 12) - typically subject to withholding tax</li>
<li><strong>Fees for Technical Services</strong> (Article 12A) - India-specific provision</li>
<li><strong>Independent Personal Services</strong> (Article 14) - professional income</li>
<li><strong>Other Income</strong> (Article 21) - residual category</li>
</ul>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #16a34a;">
<h4 style="color: #15803d; margin-bottom: 10px;">✦ Permanent Establishment Advisory</h4>
<p style="line-height: 1.7;">Assessment of PE exposure under various treaties, including <strong>fixed place PE</strong>, <strong>construction PE</strong> (typically 6-12 months threshold), <strong>service PE</strong> (183 days rule), and <strong>dependent agent PE</strong>. We help structure operations to minimize unintended PE creation while maintaining commercial effectiveness.</p>
</div>

<div style="background-color: #fefce8; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ca8a04;">
<h4 style="color: #a16207; margin-bottom: 10px;">✦ Equalisation Levy & Digital Taxation</h4>
<p style="line-height: 1.7;">Advisory on India's <strong>Equalisation Levy</strong> (EL) regime—<mark style="background-color: #fef9c3;">6% on online advertising</mark> and <mark style="background-color: #fef9c3;">2% on e-commerce operators</mark>. We help businesses understand applicability, compliance requirements, and interaction with DTAAs.</p>
</div>

<div style="background-color: #fdf4ff; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #a855f7;">
<h4 style="color: #7e22ce; margin-bottom: 10px;">✦ BEPS Compliance & Anti-Avoidance</h4>
<p style="line-height: 1.7;">Guidance on <strong>Base Erosion and Profit Shifting (BEPS)</strong> measures including <strong>MLI implications</strong>, <strong>Principal Purpose Test (PPT)</strong>, <strong>Limitation of Benefits (LOB)</strong> clauses, and India's <strong>General Anti-Avoidance Rules (GAAR)</strong>.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🏢 Industries We Serve</h3>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;">We work with clients across diverse sectors, providing <strong>industry-specific solutions</strong>:</p>

<div style="display: grid; gap: 10px; margin-bottom: 20px;">
<span style="background-color: #eff6ff; padding: 8px 15px; border-radius: 20px; display: inline-block; margin: 3px;">💻 Technology & IT Services</span>
<span style="background-color: #f0fdf4; padding: 8px 15px; border-radius: 20px; display: inline-block; margin: 3px;">🏭 Manufacturing & Engineering</span>
<span style="background-color: #fef3c7; padding: 8px 15px; border-radius: 20px; display: inline-block; margin: 3px;">💊 Pharmaceuticals & Healthcare</span>
<span style="background-color: #fce7f3; padding: 8px 15px; border-radius: 20px; display: inline-block; margin: 3px;">🏦 Financial Services & Banking</span>
<span style="background-color: #f3e8ff; padding: 8px 15px; border-radius: 20px; display: inline-block; margin: 3px;">🛒 E-commerce & Digital Business</span>
<span style="background-color: #ecfeff; padding: 8px 15px; border-radius: 20px; display: inline-block; margin: 3px;">🏗️ Infrastructure & Real Estate</span>
</div>

<p style="font-size: 16px; line-height: 1.8; background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">Our <strong>industry-specific knowledge</strong> allows us to provide tailored solutions that address unique sector challenges while ensuring <mark style="background-color: #dcfce7; padding: 2px 6px;">global tax efficiency</mark> and full regulatory compliance.</p>`
      },
      {
        title: 'NRI Taxation Services',
        shortDescription: 'Comprehensive, personalized tax support for Non-Resident Indians and Persons of Indian Origin across the globe.',
        order: 2,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">NRI Taxation Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Exclusively tailored for <strong>Non-Resident Indians (NRIs)</strong> and <strong>Persons of Indian Origin (PIOs)</strong> across the globe, our NRI taxation services provide <mark style="background-color: #dbeafe; padding: 2px 6px;">comprehensive, personalized support</mark> to address the unique tax and regulatory challenges associated with maintaining financial ties to India.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">Whether you're an NRI working in the <strong>UAE</strong>, <strong>USA</strong>, <strong>UK</strong>, <strong>Singapore</strong>, <strong>Canada</strong>, <strong>Australia</strong>, or any other country, we help you navigate Indian tax obligations with confidence. Our team understands the <em>dual challenges</em> NRIs face—complying with Indian laws while managing tax obligations in their country of residence.</p>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📋 Residential Status Determination</h3>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
<p style="line-height: 1.7; margin-bottom: 10px;">The foundation of NRI taxation begins with <strong>accurate determination of residential status</strong> under <mark style="background-color: #fef9c3;">Section 6 of the Income Tax Act</mark>. This critical determination affects your entire tax liability in India.</p>

<p style="line-height: 1.7; margin-bottom: 10px;"><strong>Key Day-Count Rules:</strong></p>
<ul style="padding-left: 20px;">
<li style="margin-bottom: 8px;"><strong>182-Day Rule:</strong> Present in India for 182 days or more = Resident</li>
<li style="margin-bottom: 8px;"><strong>60-Day Rule:</strong> Present 60+ days in current year AND 365+ days in preceding 4 years</li>
<li style="margin-bottom: 8px;"><strong>Deemed Resident:</strong> Indian citizens with income exceeding ₹15 lakhs + not liable to tax elsewhere</li>
<li style="margin-bottom: 8px;"><strong>RNOR Status:</strong> Resident but Not Ordinarily Resident—special category with limited India-taxable income</li>
</ul>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🎯 Our Comprehensive NRI Services</h3>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ Tax Return Preparation & Filing</h4>
<p style="line-height: 1.7;">Accurate preparation and <strong>e-filing of Indian income tax returns</strong> for NRIs, including computation of income from various sources, claiming appropriate deductions under <strong>Chapter VI-A</strong>, and ensuring compliance with all disclosure requirements including <strong>foreign asset reporting</strong>.</p>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ Capital Gains Planning</h4>
<p style="line-height: 1.7;">Strategic planning for sale of <strong>immovable property</strong>, <strong>shares</strong>, <strong>mutual funds</strong>, and other capital assets. We help minimize tax through proper holding period planning, <strong>indexation benefits</strong>, and reinvestment under <mark style="background-color: #dcfce7;">Sections 54, 54EC, and 54F</mark>.</p>
</div>

<div style="background-color: #fdf4ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #a855f7;">
<h4 style="color: #9333ea; margin-bottom: 10px;">✦ Rental Income Taxation</h4>
<p style="line-height: 1.7;">Guidance on taxation of rental income at <strong>30% flat rate</strong> for NRIs, TDS compliance by tenants under <strong>Section 195</strong>, and claiming deductions for <em>municipal taxes</em>, <em>standard deduction (30%)</em>, and <em>interest on housing loans</em>.</p>
</div>

<div style="background-color: #fff7ed; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #f97316;">
<h4 style="color: #ea580c; margin-bottom: 10px;">✦ FEMA Compliance</h4>
<p style="line-height: 1.7;">Comprehensive guidance on <strong>Foreign Exchange Management Act</strong> regulations—<strong>NRE/NRO/FCNR accounts</strong>, <strong>repatriation limits</strong>, <strong>LRS compliance</strong> ($250,000 annual limit), and <strong>immovable property</strong> acquisition rules.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🏠 Property Transactions for NRIs</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
<tr style="background-color: #1e40af; color: white;">
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Service</th>
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Details</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>TDS Compliance</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Section 195 - Buyer must deduct <mark style="background-color: #fee2e2;">20%/30% TDS</mark></td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Lower TDS Certificate</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Form 13 application when actual tax < TDS rate</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Capital Gains</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Cost indexation using CII (Cost Inflation Index)</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Repatriation</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Up to $1 million per FY through authorized dealers</td>
</tr>
</table>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🌍 Double Taxation Relief</h3>

<p style="font-size: 16px; line-height: 1.8; background-color: #ecfeff; padding: 15px; border-radius: 8px;">We assist NRIs in claiming <strong>relief from double taxation</strong> under applicable DTAAs, ensuring you don't pay tax twice. This includes <strong>foreign tax credit claims</strong> under <mark style="background-color: #cffafe;">Section 91</mark> and proper documentation for treaty benefits.</p>`
      },
      {
        title: 'Setup Business in India',
        shortDescription: 'End-to-end guidance for foreign entities and international entrepreneurs to establish business presence in India.',
        order: 3,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">Setting Up Business in India</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;"><mark style="background-color: #dbeafe; padding: 2px 6px;">A S Gupta & Co</mark> is your trusted partner for <strong>foreign entities</strong>, <strong>multinational groups</strong>, and <strong>international entrepreneurs</strong> aspiring to establish business presence in India. We deliver seamless, end-to-end guidance from initial conceptualization through successful operational launch.</p>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
<p style="line-height: 1.7; margin: 0;"><strong>🇮🇳 Why India?</strong> With <mark style="background-color: #dcfce7;">1.4 billion population</mark>, a growing middle class, and progressive economic reforms, India offers tremendous growth opportunities. However, market entry requires careful planning, proper entity selection, and compliance with <strong>Companies Act</strong>, <strong>FEMA regulations</strong>, and sector-specific guidelines.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🏢 Entity Structuring Options</h3>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ Wholly-owned Subsidiary (WOS)</h4>
<p style="line-height: 1.7;">The <strong>preferred choice</strong> for most foreign investors seeking complete control. Can undertake <em>manufacturing</em>, <em>trading</em>, or <em>service activities</em> with full operational freedom. Offers <strong>limited liability protection</strong> and eligibility for various tax benefits.</p>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
<h4 style="color: #b45309; margin-bottom: 10px;">✦ Joint Ventures (JV)</h4>
<p style="line-height: 1.7;">Ideal for <strong>strategic partnerships</strong> combining foreign expertise with local market knowledge. Access to established <em>distribution networks</em>, <em>local relationships</em>, and <em>sector-specific know-how</em> while sharing risks.</p>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ Limited Liability Partnership (LLP)</h4>
<p style="line-height: 1.7;">Flexible structure combining partnership benefits with <strong>limited liability</strong>. Suitable for <em>professional services</em>, <em>consulting</em>, and businesses wanting operational flexibility with <strong>lower compliance burden</strong>.</p>
</div>

<div style="background-color: #fdf4ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #a855f7;">
<h4 style="color: #9333ea; margin-bottom: 10px;">✦ Branch / Project / Liaison Office</h4>
<p style="line-height: 1.7;"><strong>Branch Office:</strong> Execute specific projects, conduct research, represent parent company<br>
<strong>Project Office:</strong> Temporary establishment for time-bound contracts<br>
<strong>Liaison Office:</strong> Market research and promotional activities only</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📋 Regulatory Approvals</h3>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>RBI Approvals:</strong> Foreign investment under FEMA</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>ROC Filings:</strong> Company/LLP incorporation</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Sector Approvals:</strong> DPIIT, SEBI, IRDAI as required</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>IEC Registration:</strong> Import-Export Code</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>GST Registration:</strong> Goods & Services Tax compliance</li>
</ul>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🔄 Post-Setup Support</h3>

<p style="font-size: 16px; line-height: 1.8; background-color: #f8fafc; padding: 15px; border-radius: 8px;">We provide ongoing support: <strong>ROC filings</strong>, <strong>tax returns</strong>, <strong>transfer pricing</strong>, <strong>payroll management</strong>, <strong>accounting</strong>, <strong>internal audit</strong>, and <strong>tax advisory</strong>. Focus on building your business while we handle regulatory complexities!</p>`
      },
      {
        title: 'Transfer Pricing Services',
        shortDescription: 'Specialized transfer pricing services ensuring compliance with Indian regulations and international guidelines.',
        order: 4,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">Transfer Pricing Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our specialized <strong>transfer pricing services</strong> are designed for <mark style="background-color: #dbeafe; padding: 2px 6px;">multinational enterprises (MNEs)</mark> engaging in international related-party transactions. We ensure full compliance with India's rigorous regulations under <strong>Sections 92 to 92F</strong> of the Income Tax Act, aligned with <strong>OECD Guidelines</strong> and <strong>BEPS recommendations</strong>.</p>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
<p style="line-height: 1.7; margin: 0;">⚠️ <strong>Why It Matters:</strong> India has one of the most <mark style="background-color: #fef9c3;">robust transfer pricing regimes</mark> globally, with extensive documentation requirements and <strong>significant penalties</strong> for non-compliance. Transfer pricing adjustments can result in tax demands running into crores.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📑 Documentation Services</h3>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ Local File Preparation</h4>
<p style="line-height: 1.7;">Detailed documentation including <strong>functional analysis</strong>, <strong>economic analysis</strong>, and <strong>benchmarking studies</strong> using databases like <em>PROWESS</em>, <em>Capitaline</em>, <em>Bureau van Dijk</em>, and <em>S&P Capital IQ</em>.</p>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ Master File & CbCR</h4>
<p style="line-height: 1.7;"><strong>Master File:</strong> Group's global operations and TP policies (BEPS Action 13)<br>
<strong>Country-by-Country Report:</strong> Aggregate information on income allocation and taxes paid globally</p>
</div>

<div style="background-color: #fdf4ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #a855f7;">
<h4 style="color: #9333ea; margin-bottom: 10px;">✦ Form 3CEB Certification</h4>
<p style="line-height: 1.7;">Annual <strong>CA certification</strong> of international and specified domestic transactions—mandatory for all entities with related-party transactions.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🎯 Transactions We Handle</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
<tr style="background-color: #1e40af; color: white;">
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Transaction Type</th>
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Examples</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Tangible Goods</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Raw materials, components, finished goods</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Services</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">IT services, business support, shared services</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Intangibles</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Royalties, license fees, technical fees</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Financial</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Loans, guarantees, cash pooling</td>
</tr>
</table>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">⚖️ Dispute Resolution</h3>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Assessment Handling:</strong> Response to show-cause notices</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Appeals:</strong> CIT(A) and ITAT representation</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>APA:</strong> Advance Pricing Agreements (unilateral/bilateral/multilateral)</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>MAP:</strong> Mutual Agreement Procedure for treaty disputes</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Safe Harbour:</strong> Application for eligible transactions</li>
</ul>

<p style="font-size: 16px; line-height: 1.8; background-color: #ecfeff; padding: 15px; border-radius: 8px;">Our goal: <strong>Defensible, commercially sustainable transfer pricing policies</strong> that minimize tax controversy while optimizing your global tax position.</p>`
      }
    ]
  },
  {
    title: 'Goods and Service Tax',
    shortDescription: 'End-to-end GST services covering registration, compliance, returns, refunds, advisory, and litigation support for businesses of all sizes.',
    icon: 'Receipt',
    order: 2,
    imageCategory: 'gst',
    content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">Goods and Services Tax (GST)</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">In India's rapidly evolving indirect tax landscape—characterized by <strong>frequent legislative amendments</strong>, <strong>real-time data matching</strong> through GSTR-2A/2B reconciliation, <strong>e-invoicing mandates</strong>, and <strong>AI-driven scrutiny</strong> by tax authorities—<mark style="background-color: #dbeafe; padding: 2px 6px;">robust GST compliance</mark> is indispensable for sustainable business success.</p>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
<p style="line-height: 1.7; margin: 0;">📅 <strong>GST Journey:</strong> Implemented on <mark style="background-color: #dcfce7;">July 1, 2017</mark>, GST unified multiple indirect taxes (Excise, VAT, Service Tax, CST) into a single comprehensive tax, fundamentally changing how Indian businesses operate.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🎯 Our Comprehensive GST Practice</h3>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 15px;"><mark style="background-color: #dbeafe; padding: 2px 6px;">A S Gupta & Co</mark> offers <strong>end-to-end GST services</strong> combining deep technical expertise with practical implementation experience. Whether you're a <em>startup</em>, an <em>MSME</em>, or a <em>large corporation</em> managing multi-state operations, we have the expertise to support your needs.</p>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📋 Core GST Services</h3>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ Registration & Compliance</h4>
<p style="line-height: 1.7;"><strong>GST Registration:</strong> New registrations, amendments, additional PoB, cancellation<br>
<strong>Compliance Management:</strong> GSTR-1, GSTR-3B, GSTR-9, GSTR-9C filing</p>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ ITC & E-Invoicing</h4>
<p style="line-height: 1.7;"><strong>ITC Optimization:</strong> GSTR-2A/2B reconciliation, vendor compliance monitoring<br>
<strong>E-invoicing:</strong> Setup, IRN generation, QR code compliance</p>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
<h4 style="color: #b45309; margin-bottom: 10px;">✦ Refunds & Health Checks</h4>
<p style="line-height: 1.7;"><strong>Refund Management:</strong> Exports, SEZ, inverted duty structure claims<br>
<strong>GST Health Checks:</strong> Compliance review, risk identification</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">💻 Technology-Enabled Solutions</h3>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Automated GSTR-2A/2B</strong> reconciliation with books of accounts</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Real-time vendor compliance</strong> monitoring and rating</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Dashboard-based</strong> compliance tracking and alerts</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Integration</strong> with Tally, SAP, Oracle, Zoho</li>
</ul>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🏭 Industry Expertise</h3>

<p style="font-size: 16px; line-height: 1.8; background-color: #f8fafc; padding: 15px; border-radius: 8px;">Specialized GST expertise for: <strong>Manufacturing</strong> • <strong>Trading</strong> • <strong>E-commerce</strong> • <strong>Construction</strong> • <strong>Hospitality</strong> • <strong>Healthcare</strong> • <strong>IT/ITES</strong> • <strong>Logistics</strong> • <strong>Financial Services</strong></p>`,
    subServices: [
      {
        title: 'GST Registration',
        shortDescription: 'Complete assistance for GST registration including threshold analysis, documentation, and multi-state registrations.',
        order: 1,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">GST Registration Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">We provide <strong>end-to-end assistance</strong> for GST registration in India, guiding clients through every aspect of the registration process with <mark style="background-color: #dbeafe; padding: 2px 6px;">expert support</mark> at each stage.</p>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
<p style="line-height: 1.7; margin-bottom: 10px;"><strong>📊 Threshold Limits:</strong></p>
<ul style="padding-left: 20px; margin: 0;">
<li><strong>Goods:</strong> Rs. <mark style="background-color: #fef9c3;">40 lakhs</mark> (Rs. 20 lakhs for special category states)</li>
<li><strong>Services:</strong> Rs. <mark style="background-color: #fef9c3;">20 lakhs</mark> (Rs. 10 lakhs for special category states)</li>
<li><strong>Compulsory:</strong> Inter-state suppliers, e-commerce operators, casual taxable persons</li>
</ul>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📋 Our Registration Services</h3>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ Threshold & Eligibility Analysis</h4>
<p style="line-height: 1.7;">Comprehensive assessment of turnover, business activities, and applicable limits. We consider <strong>aggregate turnover calculations</strong>, <strong>exempt supplies</strong>, and state-wise implications.</p>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ Composition Scheme</h4>
<p style="line-height: 1.7;">Assessment of eligibility and benefits: <strong>1% for traders</strong>, <strong>5% for restaurants</strong>, <strong>6% for manufacturers</strong>—simplified compliance at the cost of ITC.</p>
</div>

<div style="background-color: #fdf4ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #a855f7;">
<h4 style="color: #9333ea; margin-bottom: 10px;">✦ Application & Documentation</h4>
<p style="line-height: 1.7;"><strong>Form GST REG-01</strong> filing, document compilation (identity/address proofs, constitution documents, bank details), real-time tracking, and query response.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🗺️ Multi-State Registration</h3>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>State-wise strategy</strong> and timeline planning</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Centralized documentation</strong> management</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>ISD registration</strong> for credit distribution</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Consistent compliance</strong> across all locations</li>
</ul>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">🔖 Special Registrations</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
<tr style="background-color: #1e40af; color: white;">
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Category</th>
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Casual Taxable Person</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Exhibitions, temporary business</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>Non-Resident Taxable Person</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Foreign entities supplying in India</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>E-commerce</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Operators and sellers</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>TDS/TCS</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Tax deductors and collectors</td>
</tr>
</table>

<p style="font-size: 16px; line-height: 1.8; background-color: #ecfeff; padding: 15px; border-radius: 8px;">We also handle <strong>amendments</strong> (core/non-core fields), <strong>additional place of business</strong>, and <strong>cancellation/surrender</strong> when required.</p>`
      },
      {
        title: 'GST Returns',
        shortDescription: 'Meticulous preparation and timely filing of all periodic GST returns with ITC optimization and reconciliation.',
        order: 2,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">GST Returns & Compliance</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our GST returns services encompass <strong>meticulous preparation</strong> and <strong>timely filing</strong> of all periodic returns, reconciliation with books, <strong>e-invoice/IRN generation</strong>, and credit ledger management. With GST becoming increasingly <mark style="background-color: #dbeafe; padding: 2px 6px;">automated and interconnected</mark>, even small errors can cascade into significant issues.</p>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📅 Monthly/Quarterly Returns</h3>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ GSTR-1 (Outward Supplies)</h4>
<p style="line-height: 1.7;"><strong>B2B invoices</strong> (with GSTIN), <strong>B2C large</strong> (>Rs. 2.5 lakhs), <strong>B2C small</strong>, credit/debit notes, exports, nil-rated/exempt supplies. Accurate <strong>HSN-wise summary</strong> and classification.</p>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ GSTR-3B (Summary Return)</h4>
<p style="line-height: 1.7;">Monthly summary with <strong>self-assessed tax liability</strong>, <strong>ITC claims</strong>, and payment. We ensure <mark style="background-color: #dcfce7;">GSTR-1 & GSTR-3B consistency</mark> to avoid mismatches.</p>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
<h4 style="color: #b45309; margin-bottom: 10px;">✦ QRMP Scheme</h4>
<p style="line-height: 1.7;">Quarterly return filing with monthly <strong>IFF (Invoice Furnishing Facility)</strong> for B2B invoices and <strong>PMT-06</strong> monthly tax payment.</p>
</div>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📆 Annual Compliance</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
<tr style="background-color: #1e40af; color: white;">
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Return</th>
<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border: 1px solid #ddd;"><strong>GSTR-9</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Annual return consolidating all monthly/quarterly data</td>
</tr>
<tr>
<td style="padding: 12px; border: 1px solid #ddd;"><strong>GSTR-9C</strong></td>
<td style="padding: 12px; border: 1px solid #ddd;">Reconciliation statement (turnover > <mark style="background-color: #fee2e2;">Rs. 5 crores</mark>)</td>
</tr>
</table>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">💰 ITC Reconciliation & Optimization</h3>

<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>GSTR-2A/2B reconciliation</strong> with purchase register</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>Vendor follow-up</strong> for non-compliant suppliers</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>ITC reversal tracking</strong> under Rule 42/43</li>
<li style="margin-bottom: 10px; line-height: 1.7;"><strong>180-day payment rule</strong> monitoring</li>
</ul>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">📱 E-invoicing Compliance</h3>

<p style="font-size: 16px; line-height: 1.8; background-color: #fef3c7; padding: 15px; border-radius: 8px;"><strong>Mandatory for turnover > Rs. 5 crores:</strong> System setup, <strong>IRN generation</strong>, QR code compliance, integration with billing software, error resolution.</p>`
      },
      {
        title: 'GST Refunds',
        shortDescription: 'Expert assistance in claiming and expediting GST refunds for exports, SEZ supplies, inverted duty structure, and excess payments.',
        order: 3,
        content: `<h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">GST Refunds</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">We specialize in <strong>expediting GST refund claims</strong>, helping businesses <mark style="background-color: #dcfce7; padding: 2px 6px;">unlock blocked working capital</mark> tied up in accumulated credits. GST refunds are crucial for <em>exporters</em>, <em>SEZ units</em>, and businesses with <em>inverted duty structure</em>.</p>

<h3 style="color: #1e3a8a; margin-top: 30px; margin-bottom: 15px;">💰 Refund Categories We Handle</h3>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
<h4 style="color: #16a34a; margin-bottom: 10px;">✦ Export Refunds (Zero-Rated)</h4>
<p style="line-height: 1.7;"><strong>Option 1:</strong> Export under bond/LUT with refund of accumulated ITC<br>
<strong>Option 2:</strong> Export with IGST payment with refund of IGST paid<br>
We ensure proper <strong>shipping bill correlation</strong> and <strong>BRC compliance</strong>.</p>
</div>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1d4ed8; margin-bottom: 10px;">✦ SEZ Supply Refunds</h4>
<p style="line-height: 1.7;">Refund of ITC accumulated on supplies to <strong>Special Economic Zone</strong> units/developers. Authorized operations verification and documentation.</p>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
<h4 style="color: #b45309; margin-bottom: 10px;">✦ Inverted Duty Structure</h4>
<p style="line-height: 1.7;">Refund where <strong>input tax rate > output tax rate</strong>. Common in <mark style="background-color: #fef9c3;">textiles</mark>, <mark style="background-color: #fef9c3;">footwear</mark>, <mark style="background-color: #fef9c3;">fertilizers</mark>. We calculate maximum eligible refund under prescribed formula.</p>
</div>

<div style="background-color: #fdf4ff; padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #a855f7;">
<h4 style="color: #9333ea; margin-bottom: 10px;">✦ Other Refund Categories</h4>
<p style="line-height: 1.7;"><strong>Excess Cash Balance:</strong> Inadvertent payment refund<br>
<strong>Deemed Exports:</strong> EOUs, advance authorization holders<br>
<strong>Assessment/Appeal:</strong> Excess tax recovery</p>
</div>

<h3>Our Refund Process</h3>
<p>We follow a structured approach to ensure successful refund claims:</p>
<ul>
<li><strong>Eligibility Assessment:</strong> Thorough analysis of refund eligibility, applicable provisions, and documentation requirements.</li>
<li><strong>ITC Reconciliation:</strong> Verification of ITC claimed against GSTR-2A/2B and ensuring no reversal requirements apply.</li>
<li><strong>Documentation Compilation:</strong> Preparation of statement of invoices, export documents, bank realization certificates, and other supporting documents.</li>
<li><strong>RFD-01 Filing:</strong> Accurate preparation and filing of refund application in prescribed format.</li>
<li><strong>Deficiency Response:</strong> Prompt response to any deficiency memo (RFD-03) issued by the department.</li>
<li><strong>Acknowledgment Tracking:</strong> Follow-up on RFD-02 acknowledgment and refund processing status.</li>
<li><strong>Sanction & Credit:</strong> Ensuring timely sanction (RFD-06) and credit to bank account.</li>
</ul>

<h3>Common Refund Challenges We Address</h3>
<p>GST refunds often face delays or rejections due to technical or procedural issues. We help resolve:</p>
<ul>
<li>GSTR-1 and GSTR-3B mismatches affecting refund eligibility</li>
<li>Shipping bill and invoice correlation discrepancies</li>
<li>BRC/FIRC issues for export of services</li>
<li>Inverted duty structure formula disputes</li>
<li>Documentary evidence challenges</li>
<li>Unjust enrichment inquiries</li>
</ul>

<p>Our goal is to ensure timely credit realization and optimal cash flow management for your business.</p>`
      },
      {
        title: 'GST Litigation',
        shortDescription: 'Experienced representation in GST disputes from show-cause notices through appeals to higher judicial forums.',
        order: 4,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">⚖️ GST Litigation & Representation</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">In <strong>GST litigation and representation</strong>, we offer <mark style="background-color: #fef3c7; padding: 2px 6px;">battle-tested support</mark> for businesses facing disputes with tax authorities. As the GST regime matures, <em>audit and investigation activity has intensified</em>, with authorities using <strong>advanced data analytics</strong> to identify discrepancies. Our experienced team provides robust defense from <u>initial inquiry through final resolution</u>.</p>

<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #f59e0b;">
<h3 style="color: #92400e; margin-bottom: 15px; font-size: 20px;">📋 Pre-Litigation Services</h3>
<div style="display: grid; gap: 12px;">
<div style="background: white; padding: 15px; border-radius: 8px;">
<strong style="color: #b45309;">🔍 Audit Support:</strong>
<p style="margin: 8px 0 0 0; color: #78350f;">Assistance during GST audits by departmental officers, including <mark style="background-color: #fef9c3;">document preparation</mark>, query response, and representation during audit proceedings.</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px;">
<strong style="color: #b45309;">📝 Scrutiny Response:</strong>
<p style="margin: 8px 0 0 0; color: #78350f;">Handling of <strong>ASMT-10 notices</strong> (scrutiny of returns) and <strong>ASMT-11 responses</strong>, with detailed reconciliation and explanation of apparent discrepancies.</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px;">
<strong style="color: #b45309;">🛡️ Investigation Support:</strong>
<p style="margin: 8px 0 0 0; color: #78350f;">Representation during <strong>DGGI</strong> (Directorate General of GST Intelligence) and Anti-Evasion investigations, protecting client interests while ensuring cooperation.</p>
</div>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 15px 0;">⚔️ Litigation Services</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left; width: 35%;">Service</th>
<th style="padding: 15px; color: white; text-align: left;">Description</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Show Cause Notice (DRC-01)</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Drafting comprehensive, legally sound replies addressing each allegation with supporting documentation</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Personal Hearing</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Appearing before adjudicating authorities to present oral arguments</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>First Appeal (Appellate Authority)</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Appeals against orders of adjudicating officers with grounds, facts & documents</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Second Appeal (GSTAT)</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Appeals before GST Appellate Tribunal against Appellate Authority orders</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px;"><strong>High Court & Supreme Court</strong></td>
<td style="padding: 12px;">Writ petitions, constitutional challenges & substantial questions of law</td>
</tr>
</table>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #86efac;">
<h3 style="color: #166534; margin-bottom: 15px;">📜 Advance Ruling Applications</h3>
<p style="line-height: 1.7; margin-bottom: 12px;">We assist in obtaining <mark style="background-color: #bbf7d0;">certainty on GST positions</mark> through:</p>
<ul style="list-style: none; padding: 0; margin: 0;">
<li style="padding: 8px 0; border-bottom: 1px dashed #86efac;">✓ Preparation and filing before <strong>Authority for Advance Ruling (AAR)</strong></li>
<li style="padding: 8px 0; border-bottom: 1px dashed #86efac;">✓ Appeals before <strong>Appellate Authority for Advance Ruling (AAAR)</strong></li>
<li style="padding: 8px 0;">✓ Strategic analysis of when advance ruling is beneficial</li>
</ul>
</div>

<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; margin-bottom: 20px;">
<h3 style="color: #1e40af; margin-bottom: 15px;">🎯 Our Strategic Approach</h3>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">📊</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Evidence-Based</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Transaction trail & documentation</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">⚖️</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Precedent Analysis</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">CESTAT, HC & SC decisions</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">📋</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Legal Arguments</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Technical interpretation of law</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">🤝</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Settlement Options</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Cost-benefit optimization</p>
</div>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background-color: #1e40af; color: white; padding: 15px 20px; border-radius: 8px; text-align: center;"><strong>Our goal:</strong> Protect client interests and achieve favorable outcomes while maintaining constructive relationships with tax authorities.</p>`
      },
      {
        title: 'GST Consultancy',
        shortDescription: 'In-depth, actionable GST advisory on classification, valuation, ITC eligibility, and business structuring.',
        order: 5,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">💼 GST Consultancy Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 25px;">Our <strong>GST consultancy services</strong> deliver <mark style="background-color: #dbeafe; padding: 2px 6px;">in-depth, actionable insights</mark> on complex GST matters, helping businesses make informed decisions, structure transactions efficiently, and <u>stay ahead of regulatory changes</u>. We combine <em>technical knowledge</em> with practical business understanding to provide advice that's both <strong>legally sound</strong> and <strong>commercially viable</strong>.</p>

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #7dd3fc;">
<h3 style="color: #0369a1; margin-bottom: 15px; font-size: 20px;">🏷️ Classification & HSN/SAC Advisory</h3>
<p style="margin-bottom: 15px; color: #0c4a6e;">Correct classification is <strong>fundamental</strong> to GST compliance. We provide expert guidance on:</p>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #0ea5e9;">
<strong style="color: #0369a1;">HSN Codes</strong><br>
<span style="font-size: 14px; color: #64748b;">For goods based on Customs Tariff</span>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #0ea5e9;">
<strong style="color: #0369a1;">SAC Codes</strong><br>
<span style="font-size: 14px; color: #64748b;">For services classification scheme</span>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #0ea5e9;">
<strong style="color: #0369a1;">Section 8</strong><br>
<span style="font-size: 14px; color: #64748b;">Composite vs. mixed supply</span>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #0ea5e9;">
<strong style="color: #0369a1;">Works Contract</strong><br>
<span style="font-size: 14px; color: #64748b;">Construction services classification</span>
</div>
</div>
</div>

<div style="background-color: #fdf4ff; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #a855f7;">
<h3 style="color: #7e22ce; margin-bottom: 15px;">💰 Valuation Advisory (Section 15)</h3>
<p style="margin-bottom: 15px;">Determining correct value for GST purposes can be complex:</p>
<table style="width: 100%; background: white; border-radius: 8px; overflow: hidden;">
<tr style="background: #f3e8ff;">
<td style="padding: 10px; font-weight: bold; color: #7e22ce;">Transaction Value</td>
<td style="padding: 10px;">Inclusions & exclusions</td>
</tr>
<tr>
<td style="padding: 10px; font-weight: bold; color: #7e22ce;">Discounts</td>
<td style="padding: 10px;">Trade, cash & post-supply discounts</td>
</tr>
<tr style="background: #f3e8ff;">
<td style="padding: 10px; font-weight: bold; color: #7e22ce;">Free Supplies</td>
<td style="padding: 10px;">Samples & promotional items</td>
</tr>
<tr>
<td style="padding: 10px; font-weight: bold; color: #7e22ce;">Rule 28</td>
<td style="padding: 10px;">Related party transaction valuation</td>
</tr>
<tr style="background: #f3e8ff;">
<td style="padding: 10px; font-weight: bold; color: #7e22ce;">Pure Agent</td>
<td style="padding: 10px;">Concept and reimbursements</td>
</tr>
</table>
</div>

<div style="background-color: #f0fdf4; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #86efac;">
<h3 style="color: #166534; margin-bottom: 15px;">✅ ITC Eligibility & Restrictions</h3>
<div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 12px;">
<h4 style="color: #15803d; margin-bottom: 8px;">Section 16 - Eligibility Conditions</h4>
<p style="margin: 0; font-size: 14px;">✓ Possession of invoice &nbsp;✓ Receipt of goods/services &nbsp;✓ Tax paid by supplier &nbsp;✓ Return filing</p>
</div>
<div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #fca5a5;">
<h4 style="color: #dc2626; margin-bottom: 8px;">Section 17(5) - Blocked Credits</h4>
<p style="margin: 0; font-size: 14px;">🚫 Motor vehicles &nbsp;🚫 Food & beverages &nbsp;🚫 Health services &nbsp;🚫 Travel benefits</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px;">
<h4 style="color: #15803d; margin-bottom: 8px;">Rule 42/43 - Reversal Rules</h4>
<p style="margin: 0; font-size: 14px;">Mixed use assets, inputs, capital goods disposal, IGST/CGST/SGST cross-utilization</p>
</div>
</div>

<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
<h3 style="color: #854d0e; margin-bottom: 15px;">📍 Place of Supply Determination</h3>
<p style="margin-bottom: 15px; color: #713f12;">For inter-state transactions, place of supply determination is <mark style="background-color: #fde047;">critical</mark>:</p>
<ul style="list-style: none; padding: 0; margin: 0;">
<li style="padding: 10px; background: white; margin-bottom: 8px; border-radius: 8px; border-left: 4px solid #eab308;">
<strong>Goods:</strong> Movement, no movement, bill-to-ship-to scenarios
</li>
<li style="padding: 10px; background: white; margin-bottom: 8px; border-radius: 8px; border-left: 4px solid #eab308;">
<strong>Services:</strong> B2B vs. B2C rules & location determination
</li>
<li style="padding: 10px; background: white; margin-bottom: 8px; border-radius: 8px; border-left: 4px solid #eab308;">
<strong>Special Provisions:</strong> Immovable property, events, transport
</li>
<li style="padding: 10px; background: white; border-radius: 8px; border-left: 4px solid #eab308;">
<strong>OIDAR Services:</strong> Online Information Database Access & Retrieval
</li>
</ul>
</div>

<div style="background-color: #eff6ff; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
<h3 style="color: #1e40af; margin-bottom: 15px;">🏗️ Business Structuring & Transaction Planning</h3>
<p style="margin-bottom: 15px;">We help <strong>optimize GST impact</strong> through:</p>
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
<span style="background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #3b82f6;">Entity structuring</span>
<span style="background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #3b82f6;">Contract optimization</span>
<span style="background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #3b82f6;">Franchise models</span>
<span style="background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #3b82f6;">E-commerce compliance</span>
<span style="background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #3b82f6;">EPC contracts</span>
</div>
</div>

<div style="background: linear-gradient(90deg, #1e40af, #7c3aed); padding: 20px 25px; border-radius: 12px; color: white;">
<h3 style="margin-bottom: 12px; color: white;">📰 Budget & Regulatory Updates</h3>
<p style="margin: 0; line-height: 1.7;">We provide timely analysis of <strong>GST Council outcomes</strong>, budget amendments, notification/circular analysis, and <u>impact assessment</u> on your business operations. Stay ahead with our consultancy services!</p>
</div>`
      }
    ]
  },
  {
    title: 'Business Registrations',
    shortDescription: 'Complete support for startups, MSMEs, and enterprises throughout the business registration journey from entity selection to post-registration compliance.',
    icon: 'Building',
    order: 3,
    imageCategory: 'registration',
    content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">🏢 Business Registration Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;"><mark style="background-color: #dbeafe; padding: 2px 6px;">A S Gupta & Co</mark> provides comprehensive support to <strong>startups</strong>, <strong>MSMEs</strong>, and <strong>established enterprises</strong> throughout the business registration process in India. Choosing the right business structure is <u>foundational to your venture's success</u>—it affects everything from liability protection and taxation to fundraising capability and compliance burden.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">India offers multiple business structure options, each with distinct advantages and regulatory requirements. Our experienced team guides you through this critical decision, considering factors like <em>ownership structure</em>, <em>liability concerns</em>, <em>funding plans</em>, and <em>long-term exit strategy</em>.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">🏗️ Entity Selection Guidance</h3>

<div style="display: grid; gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #2563eb;">
<h4 style="color: #1e40af; margin-bottom: 8px;">🏛️ Private Limited Company</h4>
<p style="margin: 0; line-height: 1.6;">The most popular choice for <strong>scalable businesses</strong>, offering limited liability, perpetual succession, and ability to raise equity funding. <mark style="background-color: #bfdbfe;">Ideal for startups planning VC/PE investments</mark>.</p>
</div>

<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #16a34a;">
<h4 style="color: #166534; margin-bottom: 8px;">🤝 Limited Liability Partnership (LLP)</h4>
<p style="margin: 0; line-height: 1.6;">Combines <strong>partnership flexibility</strong> with limited liability protection. Lower compliance than companies, <mark style="background-color: #bbf7d0;">perfect for professional services and family businesses</mark>.</p>
</div>

<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #9333ea;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">👤 One Person Company (OPC)</h4>
<p style="margin: 0; line-height: 1.6;">Enables <strong>single entrepreneurs</strong> to operate with limited liability and corporate structure benefits. Automatic conversion to private limited at specified thresholds.</p>
</div>

<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #ca8a04;">
<h4 style="color: #854d0e; margin-bottom: 8px;">📋 Partnership Firm / Sole Proprietorship</h4>
<p style="margin: 0; line-height: 1.6;"><strong>Partnership:</strong> Traditional structure for multiple owners with operational flexibility.<br><strong>Proprietorship:</strong> Simplest structure with minimal compliance for individual entrepreneurs.</p>
</div>

<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #dc2626;">
<h4 style="color: #b91c1c; margin-bottom: 8px;">❤️ Section 8 Company (Non-Profit)</h4>
<p style="margin: 0; line-height: 1.6;">For <strong>non-profit organizations</strong> pursuing charitable objectives without profit distribution to members. Special benefits and tax exemptions available.</p>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📝 Our Registration Process</h3>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
<div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">1️⃣</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Pre-Incorporation Advisory</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Structure selection & capital planning</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">2️⃣</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Name Reservation</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">RUN application filing</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">3️⃣</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Document Drafting</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">MOA, AOA & agreements</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">4️⃣</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">DSC & DIN</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Digital signatures & IDs</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">5️⃣</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">MCA Filing</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">SPICe+ or FiLLiP submission</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">6️⃣</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Certificate & Compliance</p>
<p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">COI, PAN/TAN & GST setup</p>
</div>
</div>
</div>

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #7dd3fc;">
<h3 style="color: #0369a1; margin-bottom: 15px;">✨ Value-Added Services</h3>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
<div style="background: white; padding: 12px; border-radius: 8px;">📝 Shareholder agreements & partnership deeds</div>
<div style="background: white; padding: 12px; border-radius: 8px;">📈 ESOP design & implementation</div>
<div style="background: white; padding: 12px; border-radius: 8px;">🌍 Foreign subsidiary & FDI compliance</div>
<div style="background: white; padding: 12px; border-radius: 8px;">™️ Trademark & IP registration</div>
<div style="background: white; padding: 12px; border-radius: 8px;">🏭 MSME/Udyam registration</div>
<div style="background: white; padding: 12px; border-radius: 8px;">🚀 Startup India recognition</div>
</div>
</div>`,
    subServices: [
      {
        title: 'Company Registration',
        shortDescription: 'Complete company incorporation services under the Companies Act, 2013 including Private Limited, OPC, and Public Companies.',
        order: 1,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">🏛️ Company Registration Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 25px;">Our company registration services in India cover <strong>complete incorporation</strong> under the <mark style="background-color: #dbeafe; padding: 2px 6px;">Companies Act, 2013</mark>—the primary legislation governing companies in India. Whether you're incorporating a <em>Private Limited Company</em>, <em>One Person Company (OPC)</em>, or <em>Public Limited Company</em>, we ensure a smooth, compliant registration process that sets your business up for <u>success</u>.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📊 Types of Companies We Register</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left;">Company Type</th>
<th style="padding: 15px; color: white; text-align: left;">Requirements</th>
<th style="padding: 15px; color: white; text-align: left;">Best For</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;"><strong style="color: #1e40af;">Private Limited</strong></td>
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">Min 2 shareholders & 2 directors, max 200 shareholders</td>
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;"><mark style="background-color: #dbeafe;">Startups & growth businesses</mark></td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;"><strong style="color: #7e22ce;">One Person Company</strong></td>
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">Single shareholder & director with nominee</td>
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;"><mark style="background-color: #f3e8ff;">Solo entrepreneurs</mark></td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;"><strong style="color: #166534;">Public Limited</strong></td>
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">Min 3 directors & 7 shareholders, can list on exchanges</td>
<td style="padding: 15px; border-bottom: 1px solid #e2e8f0;"><mark style="background-color: #dcfce7;">Public offerings</mark></td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 15px;"><strong style="color: #dc2626;">Section 8 Company</strong></td>
<td style="padding: 15px;">Special registration for non-profit</td>
<td style="padding: 15px;"><mark style="background-color: #fee2e2;">NGOs & charitable orgs</mark></td>
</tr>
</table>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">⚙️ Our Incorporation Process</h3>

<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
<div style="display: grid; gap: 12px;">
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #1e40af; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
<div><strong style="color: #1e40af;">Name Reservation (RUN)</strong><br><span style="font-size: 14px; color: #64748b;">Thorough availability checks, trademark clearance, 20-day reservation</span></div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #1e40af; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
<div><strong style="color: #1e40af;">DSC & DIN Procurement</strong><br><span style="font-size: 14px; color: #64748b;">Class 3 Digital Signatures & Director Identification Numbers</span></div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #1e40af; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</span>
<div><strong style="color: #1e40af;">MOA & AOA Drafting</strong><br><span style="font-size: 14px; color: #64748b;">Memorandum defining objects, capital; Articles for governance rules</span></div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #1e40af; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">4</span>
<div><strong style="color: #1e40af;">SPICe+ (INC-32) Filing</strong><br><span style="font-size: 14px; color: #64748b;">Integrated form: registration, DIN, PAN/TAN, EPFO/ESIC, GST (optional)</span></div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #16a34a; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">✓</span>
<div><strong style="color: #166534;">Certificate of Incorporation</strong><br><span style="font-size: 14px; color: #64748b;">COI with CIN (Corporate Identification Number) & company PAN</span></div>
</div>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">✅ Post-Incorporation Setup</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ First board meeting & statutory registers</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ Share certificates & register of members</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ Auditor appointment (within 30 days)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ Bank account opening assistance</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ GST & other registrations</li>
<li style="padding: 6px 0;">✓ Compliance calendar setup</li>
</ul>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">📄 Documents Required</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">📋 PAN, Passport, Voter ID, DL (Identity)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">🏠 Aadhaar, Utility bills (Address)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">📷 Photographs of directors</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">🏢 Rent agreement, NOC (Office proof)</li>
<li style="padding: 6px 0;">✍️ Director consent & declarations</li>
</ul>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;"><strong>⏱️ Typical turnaround:</strong> 7-10 working days with error-free filing guaranteed!</p>`
      },
      {
        title: 'LLP Registration',
        shortDescription: 'Streamlined LLP registration with customized agreements tailored to your business requirements.',
        order: 2,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">🤝 LLP Registration Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 25px;">We streamline <strong>Limited Liability Partnership (LLP)</strong> registration in India, helping businesses access a unique <mark style="background-color: #dbeafe; padding: 2px 6px;">hybrid structure</mark> that combines the operational flexibility of a partnership with the <u>limited liability protection</u> of a company. Introduced through the <em>LLP Act, 2008</em>, this structure has become increasingly popular for professional services firms, family businesses, and ventures seeking partnership dynamics with corporate protection.</p>

<h3 style="color: #166534; border-bottom: 2px solid #86efac; padding-bottom: 8px; margin: 25px 0 20px 0;">✨ Why Choose LLP?</h3>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 12px; border-left: 4px solid #22c55e;">
<h4 style="color: #166534; margin-bottom: 8px;">🛡️ Limited Liability</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Partners' liability limited to agreed contribution, <strong>protecting personal assets</strong> from business obligations.</p>
</div>
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 12px; border-left: 4px solid #3b82f6;">
<h4 style="color: #1e40af; margin-bottom: 8px;">💰 No Minimum Capital</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Unlike companies, LLPs have <strong>no minimum capital requirement</strong>, making them accessible for service businesses.</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 12px; border-left: 4px solid #eab308;">
<h4 style="color: #854d0e; margin-bottom: 8px;">📊 Tax Benefits</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Flat <mark style="background-color: #fef9c3;">30% tax rate</mark>, no DDT. Partners receiving profit share don't pay additional tax.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 12px; border-left: 4px solid #a855f7;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">⚙️ Operational Flexibility</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Customized <strong>profit-sharing</strong>, decision-making, and partner roles via LLP Agreement.</p>
</div>
<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 18px; border-radius: 12px; border-left: 4px solid #f87171;">
<h4 style="color: #b91c1c; margin-bottom: 8px;">📋 Lower Compliance</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">No board meetings, AGMs, or statutory auditor (below Rs. 40 lakh contribution/turnover).</p>
</div>
<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 18px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
<h4 style="color: #0369a1; margin-bottom: 8px;">♾️ Perpetual Succession</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">LLP continues regardless of partner changes, providing <strong>business continuity</strong>.</p>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📝 LLP Registration Process</h3>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
<div style="display: grid; gap: 10px;">
<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
<strong style="color: #1e40af;">Step 1: Name Reservation (RUN-LLP)</strong>
<p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Filing for name approval with LLP naming guidelines compliance</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
<strong style="color: #6d28d9;">Step 2: DSC & DPIN</strong>
<p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Digital Signature Certificates & Designated Partner Identification Numbers</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ec4899;">
<strong style="color: #be185d;">Step 3: LLP Agreement Drafting</strong>
<p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Customized: profit/loss sharing, capital contributions, partner duties, dispute resolution</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
<strong style="color: #b45309;">Step 4: FiLLiP Form Filing</strong>
<p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Integrated incorporation form with partner & office details</p>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
<strong style="color: #16a34a;">Step 5: Certificate & Agreement Filing</strong>
<p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">LLPIN issuance + Form 3 filing within 30 days</p>
</div>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">🎯 Ideal For</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">👔 CA firms, law firms, architects, consultants</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">👨‍👩‍👧‍👦 Family businesses</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🤝 Joint ventures</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🚀 Startups (non-equity route)</li>
<li style="padding: 6px 0;">🏠 Real estate & trading businesses</li>
</ul>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">🔄 Conversion Options</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 8px 0; border-bottom: 1px dashed #fcd34d;">📈 Partnership Firm → LLP</li>
<li style="padding: 8px 0; border-bottom: 1px dashed #fcd34d;">🏢 Private Company → LLP</li>
<li style="padding: 8px 0;">⬆️ LLP → Private Company (scaling up)</li>
</ul>
</div>
</div>

<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">📅 Ongoing Compliance</h4>
<table style="width: 100%; background: white; border-radius: 8px; overflow: hidden;">
<tr style="background: #dcfce7;">
<td style="padding: 10px; font-weight: bold;">Form 11</td>
<td style="padding: 10px;">Annual Return by <strong>May 30</strong></td>
</tr>
<tr>
<td style="padding: 10px; font-weight: bold;">Form 8</td>
<td style="padding: 10px;">Statement of Accounts by <strong>October 30</strong></td>
</tr>
<tr style="background: #dcfce7;">
<td style="padding: 10px; font-weight: bold;">ITR Filing</td>
<td style="padding: 10px;">Income Tax Return annually</td>
</tr>
<tr>
<td style="padding: 10px; font-weight: bold;">Form 4</td>
<td style="padding: 10px;">Changes in partners or agreement</td>
</tr>
</table>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #166534, #22c55e); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">We provide <strong>ongoing compliance support</strong> to ensure your LLP remains in good standing with regulatory authorities! 🎯</p>`
      }
    ]
  },
  {
    title: 'Audit and Assurance Services',
    shortDescription: 'Professional audit services that enhance financial transparency, strengthen corporate governance, and build stakeholder confidence.',
    icon: 'Shield',
    order: 4,
    imageCategory: 'audit',
    content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">🔍 Audit & Assurance Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our audit and assurance services in India are designed to <strong>enhance financial transparency</strong>, strengthen corporate governance, <mark style="background-color: #dbeafe; padding: 2px 6px;">mitigate risks</mark>, and build stakeholder trust through independent, rigorous examination and insightful recommendations. In an era of <u>heightened regulatory scrutiny</u>, quality assurance services are more important than ever.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;"><mark style="background-color: #dbeafe; padding: 2px 6px;">A S Gupta & Co</mark> brings <strong>decades of collective experience</strong> in auditing businesses across industries and sizes—from emerging startups to established corporations, from manufacturing units to service enterprises. Our approach combines <em>technical rigor</em> with practical business understanding.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">⚙️ Our Audit Approach</h3>

<p style="margin-bottom: 15px;">We follow a <strong>risk-based audit methodology</strong> aligned with <mark style="background-color: #fef9c3;">Standards on Auditing (SAs)</mark> issued by ICAI:</p>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px;">
<h4 style="color: #1e40af; margin-bottom: 10px;">📋 Planning & Risk Assessment</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Understanding business, industry, and control environment to identify areas of <strong>significant risk</strong>.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px;">
<h4 style="color: #166534; margin-bottom: 10px;">🛡️ Internal Control Evaluation</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Assessing design and operating effectiveness of controls, identifying <strong>weaknesses & improvements</strong>.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 20px; border-radius: 12px;">
<h4 style="color: #7e22ce; margin-bottom: 10px;">🔬 Substantive Procedures</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Rigorous testing using <strong>sampling</strong>, analytical procedures, and detailed verification.</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 20px; border-radius: 12px;">
<h4 style="color: #854d0e; margin-bottom: 10px;">📊 Review & Reporting</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Multi-level review process with <strong>transparent reporting</strong> to management and stakeholders.</p>
</div>
</div>

<div style="background-color: #f0fdf4; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #86efac;">
<h3 style="color: #166534; margin-bottom: 15px;">✅ Quality Commitment</h3>
<p style="margin-bottom: 12px;">Every engagement is led by experienced partners following <strong>rigorous quality control</strong>:</p>
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
<span style="background: white; padding: 10px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #22c55e;">✓ Engagement quality control review</span>
<span style="background: white; padding: 10px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #22c55e;">✓ Ethical requirements & independence</span>
<span style="background: white; padding: 10px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #22c55e;">✓ Continuous professional development</span>
<span style="background: white; padding: 10px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #22c55e;">✓ Technology-enabled audit tools</span>
<span style="background: white; padding: 10px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #22c55e;">✓ Data analytics</span>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📑 Our Audit Services Portfolio</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left;">Audit Type</th>
<th style="padding: 15px; color: white; text-align: left;">Description</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>📋 Statutory Audit</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Independent audit under Companies Act, 2013</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>💰 Tax Audit</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Audit under Section 44AB of Income Tax Act</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>🔄 Internal Audit</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Risk-based evaluation of controls and processes</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>📊 GST Audit</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">GST compliance verification and reconciliation</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>🏦 Bank Audit</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Bank branch audit under RBI guidelines</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>📦 Stock Audit</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Physical verification and valuation of inventory</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px;"><strong>🏭 Fixed Asset Verification</strong></td>
<td style="padding: 12px;">Physical verification and reconciliation of assets</td>
</tr>
</table>`,
    subServices: [
      {
        title: 'Statutory Audit',
        shortDescription: 'Independent statutory audits under the Companies Act, 2013 adhering to Standards on Auditing and CARO requirements.',
        order: 1,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">📋 Statutory Audit Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 25px;">We conduct meticulous statutory audits under the <mark style="background-color: #dbeafe; padding: 2px 6px;">Companies Act, 2013</mark>, adhering to <strong>Standards on Auditing (SAs)</strong> issued by ICAI, <strong>CARO 2020</strong> reporting requirements, and <em>Ind-AS/Indian GAAP</em> compliance. Our statutory audit provides <u>independent assurance</u> on the true and fair view of financial statements.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📑 Statutory Audit Framework</h3>

<div style="display: grid; gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #2563eb;">
<h4 style="color: #1e40af; margin-bottom: 10px;">⚖️ Section 143 Requirements</h4>
<p style="margin: 0; line-height: 1.6;">Verification of <strong>loans</strong>, <strong>investments</strong>, <strong>guarantees</strong>, compliance with accounting standards, adequacy of <mark style="background-color: #bfdbfe;">internal financial controls</mark>, and other matters specified by law.</p>
</div>
<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #f59e0b;">
<h4 style="color: #92400e; margin-bottom: 10px;">📊 CARO 2020 Reporting</h4>
<p style="margin: 0; line-height: 1.6;">Detailed reporting on <strong>fixed assets</strong>, inventory, loans, Sections 185/186 compliance, public deposits, statutory dues, <mark style="background-color: #fef9c3;">fraud reporting</mark>, whistle-blower mechanism.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; border-left: 5px solid #22c55e;">
<h4 style="color: #166534; margin-bottom: 10px;">📝 Directors' Report Matters</h4>
<p style="margin: 0; line-height: 1.6;">Verification of Board's Report including <strong>related party transactions</strong>, <strong>CSR spending</strong>, and other mandatory disclosures.</p>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">⚙️ Our Statutory Audit Process</h3>

<div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
<div style="display: grid; gap: 10px;">
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #3b82f6; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</span>
<div><strong style="color: #1e40af;">Engagement Acceptance</strong> — Independence assessment, conflict check, risk evaluation</div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #8b5cf6; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</span>
<div><strong style="color: #6d28d9;">Planning Phase</strong> — Understanding business, identifying risks, determining materiality</div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #ec4899; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</span>
<div><strong style="color: #be185d;">Risk Assessment</strong> — Fraud risk evaluation, material misstatement areas</div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #f59e0b; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">4</span>
<div><strong style="color: #b45309;">Internal Control Testing</strong> — Design & operating effectiveness, IT general controls</div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #0ea5e9; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">5</span>
<div><strong style="color: #0369a1;">Substantive Testing</strong> — Inspection, observation, inquiry, confirmation, recalculation</div>
</div>
<div style="background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
<span style="background: #22c55e; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">✓</span>
<div><strong style="color: #16a34a;">Completion & Reporting</strong> — Audit report, management letter, Audit Committee presentation</div>
</div>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #fdf4ff; padding: 20px; border-radius: 12px; border: 2px solid #e9d5ff;">
<h4 style="color: #7e22ce; margin-bottom: 12px;">📚 Ind-AS & GAAP Compliance</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #e9d5ff;">✓ Ind-AS for specified companies</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #e9d5ff;">✓ Indian GAAP for other entities</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #e9d5ff;">✓ Schedule III requirements</li>
<li style="padding: 6px 0;">✓ First-time Ind-AS adoption guidance</li>
</ul>
</div>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 12px; border: 2px solid #bae6fd;">
<h4 style="color: #0369a1; margin-bottom: 12px;">💬 Auditor Communication</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #bae6fd;">📋 Audit planning memorandum</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #bae6fd;">📊 Regular status updates</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #bae6fd;">💡 Timely findings discussion</li>
<li style="padding: 6px 0;">📝 Detailed management letter</li>
</ul>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">Our goal: Complete audits <strong>efficiently</strong> while providing valuable insights to improve financial reporting and internal controls! 🎯</p>`
      },
      {
        title: 'Internal Audit',
        shortDescription: 'Risk-based internal audit services providing independent assurance on governance, risk management, and internal controls.',
        order: 2,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">🔄 Internal Audit Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our <strong>risk-based internal audit services</strong> evaluate and fortify internal controls, <mark style="background-color: #fef3c7; padding: 2px 6px;">fraud detection mechanisms</mark>, process efficiencies, regulatory compliance, and <em>ESG considerations</em>. We deliver <u>actionable insights</u> to senior management and audit committees.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">Internal audit has evolved from a compliance-focused function to a <strong>strategic advisory role</strong>. We help organizations leverage internal audit as a value-adding function that provides assurance, identifies improvement opportunities, and supports achievement of business objectives.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">⚙️ Our Internal Audit Methodology</h3>

<div style="display: grid; gap: 12px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #1e40af; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">1</span>
<div><strong style="color: #1e40af;">Risk Assessment & Planning</strong><br><span style="font-size: 14px; color: #64748b;">Enterprise-wide risk assessment, risk-based audit plan aligned with organizational priorities</span></div>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #166534; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">2</span>
<div><strong style="color: #166534;">Process Documentation</strong><br><span style="font-size: 14px; color: #64748b;">Detailed understanding of business processes, control activities, and information flows</span></div>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #7e22ce; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">3</span>
<div><strong style="color: #7e22ce;">Control Evaluation</strong><br><span style="font-size: 14px; color: #64748b;">Testing design adequacy and operating effectiveness, identifying gaps and weaknesses</span></div>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #854d0e; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">4</span>
<div><strong style="color: #854d0e;">Root Cause Analysis</strong><br><span style="font-size: 14px; color: #64748b;">Going beyond symptoms to identify underlying causes of control failures</span></div>
</div>
<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #dc2626; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">5</span>
<div><strong style="color: #b91c1c;">Recommendations & Follow-Up</strong><br><span style="font-size: 14px; color: #64748b;">Practical recommendations, tracking implementation, verifying remediation effectiveness</span></div>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📋 Internal Audit Coverage Areas</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left;">Area</th>
<th style="padding: 15px; color: white; text-align: left;">Coverage</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>💰 Financial Controls</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Revenue cycle, procurement, payroll, treasury, financial reporting</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>⚙️ Operational Processes</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Production, inventory, quality control, logistics, customer service</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>📜 Compliance</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Regulatory, statutory (Companies Act, labor, environmental), contractual</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>💻 IT General Controls</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Access controls, change management, backup, disaster recovery, cybersecurity</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>🚨 Fraud Risk</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Fraud risk assessment, detection controls, investigation support</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px;"><strong>🏛️ Governance</strong></td>
<td style="padding: 12px;">Board effectiveness, committee functioning, delegation, ethics</td>
</tr>
</table>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">🤝 Engagement Models</h4>
<div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
<strong style="color: #16a34a;">Full Outsourcing</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">We act as your complete internal audit function</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
<strong style="color: #16a34a;">Co-Sourcing</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">Supplement your team with specialized skills</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px;">
<strong style="color: #16a34a;">Project-Based</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">Focused engagements on specific areas/risks</p>
</div>
</div>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">📊 Reporting & Communication</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">📋 Executive summary with key findings</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🔍 Detailed findings with risk rating</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">💡 Process improvement observations</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">📈 Quarterly/annual Audit Committee summary</li>
<li style="padding: 6px 0;">📊 Trend analysis & benchmarking</li>
</ul>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #166534, #22c55e); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">Our internal audit services help organizations <strong>strengthen governance</strong>, improve operations, and achieve greater accountability! 🎯</p>`
      },
      {
        title: 'Fixed Asset Audit',
        shortDescription: 'Thorough fixed asset audits ensuring accurate balance sheet representation and Schedule II compliance.',
        order: 3,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">🏭 Fixed Asset Audit Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">We perform thorough fixed asset audits involving <strong>physical verification</strong>, title deeds review, <mark style="background-color: #dbeafe; padding: 2px 6px;">impairment testing</mark>, capitalization checks, and depreciation accuracy to ensure reliable balance sheet representation and compliance with <u>Schedule II</u> of the Companies Act, 2013.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">Fixed assets often constitute the <strong>largest component</strong> of a company's balance sheet, particularly for manufacturing, infrastructure, and capital-intensive businesses. Accurate records are essential for <em>financial reporting</em>, <em>insurance coverage</em>, <em>tax compliance</em>, and operational planning.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">🔍 Our Fixed Asset Audit Services</h3>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #1e40af; margin-bottom: 8px;">📋 Physical Verification</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Systematic inspection across all locations, using <strong>tagging</strong>, photography, and GPS coordinates.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #166534; margin-bottom: 8px;">🏷️ Asset Identification</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Verification of descriptions, serial numbers, and <strong>unique identifiers</strong> against FAR.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">📜 Title Document Verification</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Review of title deeds, <strong>ownership records</strong>, and identification of encumbrances.</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #854d0e; margin-bottom: 8px;">💰 Capitalization Review</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Policy verification, <strong>capital vs revenue</strong> classification of additions.</p>
</div>
<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #b91c1c; margin-bottom: 8px;">📊 Depreciation Verification</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Testing calculations, <strong>useful lives per Schedule II</strong>, component accounting compliance.</p>
</div>
<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #0369a1; margin-bottom: 8px;">⚠️ Impairment Assessment</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Review for physical damage, <strong>obsolescence</strong>, underutilization, market decline.</p>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">📑 FAR Reconciliation</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ FAR vs general ledger reconciliation</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ Block-wise & asset-wise classification</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ Addition, deletion & transfer tracking</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">✓ WIP to capitalization review</li>
<li style="padding: 6px 0;">✓ Fully depreciated assets identification</li>
</ul>
</div>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">⚖️ Compliance Verification</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">📋 Schedule II depreciation rates</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">📚 Ind-AS 16 / AS-10 compliance</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🔄 Revaluation model (if applicable)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🏢 Ind-AS 40 (Investment property)</li>
<li style="padding: 6px 0;">📝 Ind-AS 116 (Lease accounting)</li>
</ul>
</div>
</div>

<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">📊 Our Report Includes</h4>
<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">Physical verification results</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">Variance analysis</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">Missing assets list</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">Title deed status</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">Depreciation observations</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">FAR improvements</span>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">Regular fixed asset audits help maintain <strong>accurate records</strong>, support insurance claims, and ensure compliance! 🏭</p>`
      },
      {
        title: 'Stock Audit',
        shortDescription: 'Comprehensive stock audit services critical for working capital management and bank financing requirements.',
        order: 4,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">📦 Stock Audit Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our stock audit services include <strong>physical stock-taking</strong>, valuation under <mark style="background-color: #dbeafe; padding: 2px 6px;">AS-2/Ind-AS 2</mark>, obsolescence assessment, reconciliation with perpetual records, and detailed reporting. Stock audits are critical for <u>working capital management</u>, bank financing requirements, and accurate financial reporting.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">Inventory is often one of the <strong>largest current assets</strong> and most susceptible to misstatement due to its physical nature, multiple locations, and valuation complexities. Our systematic approach ensures accurate inventory reporting while identifying operational improvements.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📋 Stock Audit Services</h3>

<div style="display: grid; gap: 12px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #2563eb;">
<h4 style="color: #1e40af; margin-bottom: 8px;">🔍 Physical Stock Verification</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Systematic count across warehouses, godowns, consignment stock. Methods: <mark style="background-color: #bfdbfe;">complete count</mark>, <mark style="background-color: #bfdbfe;">sample count</mark>, or <mark style="background-color: #bfdbfe;">cycle count</mark>.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #22c55e;">
<h4 style="color: #166534; margin-bottom: 8px;">📊 Quantity Reconciliation</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Matching physical quantities with <strong>stock ledger</strong>, bin cards, and accounting records. Variance investigation.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #a855f7;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">💰 Valuation Verification</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Testing at <strong>lower of cost or NRV</strong>. Review of FIFO, weighted average methods for consistency.</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #eab308;">
<h4 style="color: #854d0e; margin-bottom: 8px;">🧮 Cost Computation</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Verification of cost build-up: <strong>raw material</strong>, labor, overhead allocation. Standard cost variance review.</p>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #fef2f2; padding: 20px; border-radius: 12px; border: 2px solid #fca5a5;">
<h4 style="color: #b91c1c; margin-bottom: 12px;">⚠️ Slow-Moving & Obsolete Stock</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">📉 Slow-moving based on turnover</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">🔧 Obsolete (tech/discontinued)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">💔 Damaged or deteriorated</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">📊 Provision adequacy check</li>
<li style="padding: 6px 0;">💡 Liquidation/write-off recommendations</li>
</ul>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">🏦 Bank Stock Audits</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📋 Stock statements verification</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📊 Drawing power calculation</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">💰 Margin requirements compliance</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📑 Hypothecation documentation</li>
<li style="padding: 6px 0;">🛡️ Insurance coverage verification</li>
</ul>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">🏭 Industry-Specific Expertise</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left;">Industry</th>
<th style="padding: 15px; color: white; text-align: left;">Specific Challenges</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>🏭 Manufacturing</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Raw materials, WIP, finished goods, process costing</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>🛒 Trading/Retail</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Multiple SKUs, high-volume, shrinkage concerns</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>💊 Pharmaceuticals</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Batch tracking, expiry monitoring, controlled substances</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>🏗️ Construction</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Materials at multiple project sites</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px;"><strong>🌾 Agriculture</strong></td>
<td style="padding: 12px;">Perishable commodities, quality variations</td>
</tr>
</table>

<div style="background: linear-gradient(90deg, #1e40af, #7c3aed); padding: 20px; border-radius: 12px; color: white;">
<h4 style="margin-bottom: 10px; color: white;">📊 Our Stock Audit Report Includes:</h4>
<p style="margin: 0; line-height: 1.7;">Physical verification results • Quantity & value variances • <strong>Obsolete stock analysis</strong> • Valuation adjustments • Storage observations • <strong>Process improvement recommendations</strong></p>
</div>`
      },
      {
        title: 'Tax Audit',
        shortDescription: 'Precise tax audits under Section 44AB ensuring compliance and minimizing assessment risks.',
        order: 5,
        content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">💰 Tax Audit Services (Section 44AB)</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 25px;">We execute precise tax audits under <mark style="background-color: #dbeafe; padding: 2px 6px;">Section 44AB</mark> of the Income Tax Act, verifying specified particulars, <strong>tax computation accuracy</strong>, potential disallowances, and ensuring timely submission of <em>Form 3CA/3CB/3CD</em>. A thorough tax audit helps identify <u>tax planning opportunities</u> while minimizing assessment and penalty risks.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📋 Tax Audit Applicability</h3>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #fcd34d;">
<p style="margin-bottom: 12px; font-weight: bold; color: #92400e;">Tax audit is mandatory for:</p>
<div style="display: grid; gap: 10px;">
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
<strong>💼 Businesses:</strong> Turnover > <mark style="background-color: #fef9c3;">Rs. 1 crore</mark> (Rs. 10 crores if cash < 5%)
</div>
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
<strong>👔 Professionals:</strong> Gross receipts > <mark style="background-color: #fef9c3;">Rs. 50 lakhs</mark>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
<strong>📊 Presumptive Tax:</strong> Sections 44AD/44ADA/44AE claimants with income > basic exemption
</div>
<div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
<strong>🔄 Opt-Out:</strong> Taxpayers opting out of presumptive scheme in subsequent years
</div>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">⚙️ Our Tax Audit Process</h3>

<div style="display: grid; gap: 12px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #1e40af; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">1</span>
<div><strong style="color: #1e40af;">Pre-Audit Planning</strong><br><span style="font-size: 14px; color: #64748b;">Understanding business operations, revenue streams, reviewing previous audits</span></div>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #166534; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">2</span>
<div><strong style="color: #166534;">Books of Account Verification</strong><br><span style="font-size: 14px; color: #64748b;">Proper maintenance per laws & standards, transaction authenticity testing</span></div>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #7e22ce; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">3</span>
<div><strong style="color: #7e22ce;">Clause-by-Clause Compliance</strong><br><span style="font-size: 14px; color: #64748b;">All 44 clauses of Form 3CD: entity details, policies, statutory compliance</span></div>
</div>
<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 18px; border-radius: 10px; display: flex; gap: 15px; align-items: flex-start;">
<span style="background: #dc2626; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold;">4</span>
<div><strong style="color: #b91c1c;">Disallowance Analysis</strong><br><span style="font-size: 14px; color: #64748b;">Section 40(a) TDS, Section 40A(3) cash, Section 43B statutory liabilities</span></div>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">🔍 Key Verification Areas</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left;">Section/Area</th>
<th style="padding: 15px; color: white; text-align: left;">Verification</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Section 32</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Depreciation computation & compliance</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Section 40(a)(ia)</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">TDS compliance & disallowances</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Section 40A(3)</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Cash payment disallowances (> Rs. 10,000)</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Section 43B</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Statutory liabilities payment verification</td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Section 40A(2)(b)</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Related party transactions</td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px;"><strong>TCS Compliance</strong></td>
<td style="padding: 12px;">Tax collected at source verification</td>
</tr>
</table>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">📑 Form 3CD Reporting</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 5px 0;">✓ Business description & accounting method</li>
<li style="padding: 5px 0;">✓ Deductions & statutory dues details</li>
<li style="padding: 5px 0;">✓ Trading transaction quantitatives</li>
<li style="padding: 5px 0;">✓ GST reconciliation with financials</li>
<li style="padding: 5px 0;">✓ Secondary adjustment reporting</li>
</ul>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">📤 Report Filing</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 5px 0;">📋 Form 3CA (statutory audit) / 3CB</li>
<li style="padding: 5px 0;">📊 Form 3CD with detailed particulars</li>
<li style="padding: 5px 0;">📎 All applicable annexures</li>
<li style="padding: 5px 0;">🔐 UDIN generation & compliance</li>
<li style="padding: 5px 0;">⏰ Timely e-filing ensured</li>
</ul>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">Our tax audits ensure <strong>accurate compliance</strong> while identifying legitimate tax-saving opportunities and minimizing scrutiny risks! 💰</p>`
      }
    ]
  },
  {
    title: 'Accounting and Book Keeping',
    shortDescription: 'Professional accounting services delivering accurate, timely financial records using leading software platforms.',
    icon: 'Calculator',
    order: 5,
    imageCategory: 'accounting',
    content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">📊 Accounting & Book-Keeping Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">At <mark style="background-color: #dbeafe; padding: 2px 6px;">A S Gupta & Co</mark>, our accounting and book-keeping services deliver <strong>accurate, timely financial record maintenance</strong> that forms the foundation of sound business management. We understand that maintaining proper books is not just a compliance requirement—it's essential for <u>informed decision-making</u>, performance monitoring, and business growth.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">Whether you're a <strong>startup</strong> focused on growth, an <strong>MSME</strong> managing operations, or an <strong>established business</strong> seeking efficiency, we provide scalable accounting solutions tailored to your needs.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📋 Our Accounting Services</h3>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #1e40af; margin-bottom: 8px;">📝 Daily/Weekly/Monthly Bookkeeping</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Recording all transactions, maintaining <strong>general ledger</strong>, sub-ledgers, and supporting schedules.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #166534; margin-bottom: 8px;">🏦 Bank Reconciliation</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Regular reconciliation of bank accounts, credit cards, loan accounts, <strong>discrepancy investigation</strong>.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">📤 Accounts Payable</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Vendor invoice processing, <strong>payment scheduling</strong>, aging analysis, vendor reconciliations.</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #854d0e; margin-bottom: 8px;">📥 Accounts Receivable</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Customer invoicing, receipt tracking, <strong>aging analysis</strong>, overdue follow-ups.</p>
</div>
<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #b91c1c; margin-bottom: 8px;">👥 Payroll Processing</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Salary computation, <strong>PF, ESI, TDS</strong> deductions, payslip generation.</p>
</div>
<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #0369a1; margin-bottom: 8px;">📊 Financial Statements</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;"><strong>Balance Sheet</strong>, Profit & Loss, Cash Flow — monthly/quarterly/annual.</p>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">💻 Software Expertise</h3>

<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 15px 20px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
<span style="font-size: 28px;">📗</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #92400e;">Tally Prime</p>
<p style="margin: 4px 0 0 0; font-size: 12px; color: #78350f;">India's most popular, GST-compliant</p>
</div>
<div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 15px 20px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
<span style="font-size: 28px;">☁️</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #166534;">QuickBooks</p>
<p style="margin: 4px 0 0 0; font-size: 12px; color: #14532d;">Cloud-based modern accounting</p>
</div>
<div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 15px 20px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
<span style="font-size: 28px;">📚</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #1e40af;">Zoho Books</p>
<p style="margin: 4px 0 0 0; font-size: 12px; color: #1e3a8a;">Integrated business suite</p>
</div>
<div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 15px 20px; border-radius: 10px; text-align: center; flex: 1; min-width: 150px;">
<span style="font-size: 28px;">🏢</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #7e22ce;">SAP Business One</p>
<p style="margin: 4px 0 0 0; font-size: 12px; color: #581c87;">Enterprise solutions</p>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">☁️ Cloud-Based Solutions</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">🌐 Real-time access from anywhere</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">💾 Automatic backup & data security</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">👥 Multi-user collaboration</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">🔗 Bank feed integration</li>
<li style="padding: 6px 0;">📱 Mobile access for approvals</li>
</ul>
</div>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">📊 Management Reporting</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">📋 Customized MIS & dashboards</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">📈 Budget vs actual analysis</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">💰 Cash flow projections</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🎯 KPI tracking</li>
<li style="padding: 6px 0;">📊 Cost/profit center analysis</li>
</ul>
</div>
</div>

<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">✨ Benefits of Outsourcing to Us</h4>
<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">👨‍💼 Trained professionals</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">📈 Scalable services</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">✅ Reduced errors</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">⏰ Timely completion</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">🎯 Focus on core business</span>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">We free businesses to focus on <strong>strategic growth</strong> while ensuring audit-ready books and data-driven decision support! 📊</p>`,
    subServices: []
  },
  {
    title: 'Tax Consultancy',
    shortDescription: 'Strategic direct and indirect tax planning, compliance, and representation services for businesses and individuals.',
    icon: 'TrendingUp',
    order: 6,
    imageCategory: 'tax-consultancy',
    content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">💰 Tax Consultancy Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our tax consultancy services in India provide strategic <strong>direct and indirect tax planning</strong>, compliance management, <mark style="background-color: #dbeafe; padding: 2px 6px;">assessment representation</mark>, appellate support, and opinions on complex transactions. We help businesses and individuals navigate India's <u>complex tax landscape</u> while optimizing their tax positions within the framework of law.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;"><strong>Tax planning is not about evasion</strong>—it's about structuring affairs efficiently, claiming all legitimate benefits, and avoiding unnecessary tax exposure through proper planning. Our team combines <em>technical expertise</em> with practical experience to deliver tax solutions that work.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📋 Direct Tax Services</h3>

<div style="display: grid; gap: 12px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #2563eb;">
<h4 style="color: #1e40af; margin-bottom: 8px;">🎯 Tax Planning</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Strategic planning through legitimate <strong>deductions</strong>, <strong>exemptions</strong>, and timing strategies. Business structure analysis for tax efficiency.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #22c55e;">
<h4 style="color: #166534; margin-bottom: 8px;">📝 Income Tax Return Preparation</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Accurate filing: <mark style="background-color: #bbf7d0;">ITR-1 to ITR-4</mark> (individuals/HUFs), <mark style="background-color: #bbf7d0;">ITR-5</mark> (firms/LLPs), <mark style="background-color: #bbf7d0;">ITR-6</mark> (companies), <mark style="background-color: #bbf7d0;">ITR-7</mark> (trusts).</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #eab308;">
<h4 style="color: #854d0e; margin-bottom: 8px;">📅 Advance Tax Planning</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Quarterly computation and payment planning to avoid interest under <strong>Sections 234B and 234C</strong>.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #a855f7;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">🏠 Capital Gains Planning</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Strategic planning for property, shares, assets. Reinvestment under <strong>Sections 54, 54EC, 54F</strong>.</p>
</div>
<div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #f87171;">
<h4 style="color: #b91c1c; margin-bottom: 8px;">📊 TDS/TCS Compliance</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Monthly computation, deposit, quarterly returns. <strong>Lower deduction certificate</strong> applications.</p>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📦 Indirect Tax Services</h3>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">📊</span>
<p style="margin: 10px 0 5px 0; font-weight: bold; color: #1e40af;">GST Advisory</p>
<p style="margin: 0; font-size: 13px; color: #64748b;">Classification, valuation, ITC eligibility</p>
</div>
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">🚢</span>
<p style="margin: 10px 0 5px 0; font-weight: bold; color: #1e40af;">Customs & Foreign Trade</p>
<p style="margin: 0; font-size: 13px; color: #64748b;">Duty optimization, FTA claims</p>
</div>
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; text-align: center; border: 2px solid #e2e8f0;">
<span style="font-size: 28px;">📜</span>
<p style="margin: 10px 0 5px 0; font-weight: bold; color: #1e40af;">Legacy Matters</p>
<p style="margin: 0; font-size: 13px; color: #64748b;">Central Excise & Service Tax</p>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">⚖️ Assessment & Scrutiny Representation</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">📋 Sections 142(1), 143(2), 148 notices</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">🏛️ Scrutiny assessment representation</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">📝 Information requests & surveys</li>
<li style="padding: 6px 0;">⚖️ Settlement Commission applications</li>
</ul>
</div>

<div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">📜 Appellate Support</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">👨‍⚖️ CIT(A) Appeals</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">⚖️ ITAT Appeals</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #93c5fd;">🏛️ High Court & Supreme Court</li>
<li style="padding: 6px 0;">📝 Written submissions drafting</li>
</ul>
</div>
</div>

<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">✨ Special Services</h4>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
<div style="background: white; padding: 12px; border-radius: 8px;">
<strong style="color: #16a34a;">🚀 Startup Tax Benefits</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">Section 80-IAC registration & exemptions</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px;">
<strong style="color: #16a34a;">👼 Angel Tax</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">Section 56(2)(viib) compliance & valuation</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px;">
<strong style="color: #16a34a;">📈 ESOP Taxation</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">Employee stock option planning</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px;">
<strong style="color: #16a34a;">❤️ Charitable Organizations</strong>
<p style="margin: 4px 0 0 0; font-size: 13px;">Section 12A/80G registration for NGOs</p>
</div>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">We combine <strong>proactive planning</strong> with defensive compliance to achieve legitimate tax savings! 💰</p>`,
    subServices: []
  },
  {
    title: 'Company Secretarial Services',
    shortDescription: 'Comprehensive company secretarial services ensuring corporate law compliance and good governance practices.',
    icon: 'FileText',
    order: 7,
    imageCategory: 'company-secretarial',
    content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">📝 Company Secretarial Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">We deliver comprehensive company secretarial services that ensure your organization remains compliant with the <mark style="background-color: #dbeafe; padding: 2px 6px;">Companies Act, 2013</mark>, <strong>SEBI regulations</strong> (for listed entities), <strong>FEMA provisions</strong>, and other applicable corporate laws. Good corporate governance <u>builds stakeholder confidence</u>, supports business growth, and protects directors from personal liability.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #f87171;"><strong>⚠️ Non-compliance can result in:</strong> significant penalties, prosecution of directors, and reputational damage. Our experienced team helps you navigate these requirements efficiently, ensuring all statutory deadlines are met.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">📅 Annual Compliance Services</h3>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
<tr style="background: linear-gradient(90deg, #1e40af, #3b82f6);">
<th style="padding: 15px; color: white; text-align: left;">Compliance</th>
<th style="padding: 15px; color: white; text-align: left;">Form</th>
<th style="padding: 15px; color: white; text-align: left;">Due Date</th>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Annual Return</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">MGT-7/MGT-7A</td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><mark style="background-color: #fef9c3;">60 days of AGM</mark></td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Financial Statements</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">AOC-4/AOC-4 CFS</td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><mark style="background-color: #fef9c3;">30 days of AGM</mark></td>
</tr>
<tr style="background-color: #f8fafc;">
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Director KYC</strong></td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">DIR-3 KYC</td>
<td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><mark style="background-color: #fef9c3;">30th September</mark></td>
</tr>
<tr style="background-color: #ffffff;">
<td style="padding: 12px;"><strong>Board Meetings</strong></td>
<td style="padding: 12px;">—</td>
<td style="padding: 12px;"><mark style="background-color: #fef9c3;">Min 4/year, gap ≤ 120 days</mark></td>
</tr>
</table>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">⚡ Event-Based Compliances</h3>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #1e40af; margin-bottom: 10px;">👤 Director Changes</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Appointment (<strong>DIR-12</strong>), resignation (<strong>DIR-11</strong>), changes (<strong>DIR-6</strong>)</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #166534; margin-bottom: 10px;">💰 Share Capital Changes</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Allotment (<strong>PAS-3</strong>), authorized capital (<strong>SH-7</strong>), rights/bonus issues</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #7e22ce; margin-bottom: 10px;">🔗 Charge Registration</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Creation/modification (<strong>CHG-1</strong>), satisfaction (<strong>CHG-4</strong>)</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 12px;">
<h4 style="color: #854d0e; margin-bottom: 10px;">🏢 Registered Office Change</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Within city (<strong>INC-22</strong>), within/other state (<strong>INC-23</strong>)</p>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">🏛️ Corporate Governance</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📊 Board evaluation (annual)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📝 Policy drafting (RPT, whistle-blower, CSR)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">👥 Committee constitution</li>
<li style="padding: 6px 0;">⚖️ SS-1 & SS-2 compliance</li>
</ul>
</div>

<div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">📈 Listed Company Compliances</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">📋 Quarterly governance reports</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">📊 Shareholding pattern disclosures</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fcd34d;">🔗 RPT approvals & disclosures</li>
<li style="padding: 6px 0;">📝 Investor grievance reporting</li>
</ul>
</div>
</div>

<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #93c5fd;">
<h4 style="color: #1e40af; margin-bottom: 12px;">📤 ROC Filings & Documentation</h4>
<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">📝 e-Form preparation</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">🔐 DSC coordination</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">💳 Filing & payment</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">📊 SRN tracking</span>
<span style="background: white; padding: 8px 14px; border-radius: 20px; font-size: 13px;">⏰ Condonation of delay</span>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">Ensure <strong>100% corporate compliance</strong> with our comprehensive secretarial services! 📝</p>`,
    subServices: []
  },
  {
    title: 'Advisory Services',
    shortDescription: 'Strategic advisory services including financial due diligence, valuations, M&A support, and business restructuring guidance.',
    icon: 'Briefcase',
    order: 8,
    imageCategory: 'advisory',
    content: `<h2 style="color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 12px; margin-bottom: 25px;">💼 Advisory Services</h2>

<p style="font-size: 17px; line-height: 1.8; margin-bottom: 20px;">Our wide-ranging advisory services encompass <strong>financial due diligence</strong>, business valuation, <mark style="background-color: #dbeafe; padding: 2px 6px;">transaction structuring</mark>, merger & acquisition support, business restructuring, <em>insolvency advisory under IBC</em>, fundraising strategy, and regulatory impact assessments. We provide strategic guidance tailored to empower <u>confident, value-accretive business decisions</u>.</p>

<p style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">In today's dynamic business environment, organizations face complex decisions that require <strong>multidisciplinary expertise</strong>. Whether you're acquiring a business, raising capital, restructuring operations, or navigating distress, our experienced team provides the insights and support you need.</p>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">🤝 M&A Advisory Services</h3>

<div style="display: grid; gap: 12px; margin-bottom: 25px;">
<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #2563eb;">
<h4 style="color: #1e40af; margin-bottom: 8px;">🔍 Financial Due Diligence</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Comprehensive analysis of <strong>financial statements</strong>, accounting policies, working capital, debt, contingent liabilities. Identify deal breakers & valuation adjustments.</p>
</div>
<div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #22c55e;">
<h4 style="color: #166534; margin-bottom: 8px;">💰 Tax Due Diligence</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Review of tax positions, pending assessments, <strong>contingent tax liabilities</strong>, and post-transaction optimization opportunities.</p>
</div>
<div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #a855f7;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">📊 Business Valuation</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Independent valuation: <mark style="background-color: #f3e8ff;">DCF</mark>, <mark style="background-color: #f3e8ff;">comparable company</mark>, <mark style="background-color: #f3e8ff;">comparable transactions</mark>, asset-based approaches.</p>
</div>
<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #eab308;">
<h4 style="color: #854d0e; margin-bottom: 8px;">⚙️ Transaction Structuring</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Optimal deal structure: <strong>share purchase vs asset purchase</strong>, merger vs demerger, tax & regulatory considerations.</p>
</div>
<div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 18px; border-radius: 10px; border-left: 5px solid #0ea5e9;">
<h4 style="color: #0369a1; margin-bottom: 8px;">📜 Scheme of Arrangement</h4>
<p style="margin: 0; font-size: 14px; line-height: 1.6;">Drafting merger/demerger schemes, shareholder/creditor meetings, <strong>NCLT filing</strong>, post-scheme implementation.</p>
</div>
</div>

<h3 style="color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin: 25px 0 20px 0;">🔄 Business Restructuring</h3>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; border: 2px solid #e2e8f0;">
<h4 style="color: #1e40af; margin-bottom: 8px;">🏢 Corporate Restructuring</h4>
<p style="margin: 0; font-size: 14px;">Holding company formation, internal reorganizations for <strong>tax efficiency</strong> & operational synergies.</p>
</div>
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; border: 2px solid #e2e8f0;">
<h4 style="color: #7e22ce; margin-bottom: 8px;">🔀 Demerger & Spin-Off</h4>
<p style="margin: 0; font-size: 14px;">Tax-neutral demergers to separate divisions, <strong>unlock value</strong>, or prepare for listings.</p>
</div>
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; border: 2px solid #e2e8f0;">
<h4 style="color: #166534; margin-bottom: 8px;">💵 Capital Reduction</h4>
<p style="margin: 0; font-size: 14px;">Selective schemes to return excess capital or <strong>exit shareholders</strong>.</p>
</div>
<div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; border: 2px solid #e2e8f0;">
<h4 style="color: #b45309; margin-bottom: 8px;">🌍 Cross-Border Restructuring</h4>
<p style="margin: 0; font-size: 14px;">International restructuring with <strong>FEMA</strong>, tax treaties & foreign regulations.</p>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px;">
<div style="background-color: #fef2f2; padding: 20px; border-radius: 12px; border: 2px solid #fca5a5;">
<h4 style="color: #b91c1c; margin-bottom: 12px;">⚠️ Insolvency & Distress Advisory</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">⚖️ IBC Advisory (CIRP, voluntary liquidation)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">👨‍💼 Resolution Professional Support</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #fca5a5;">🤝 One-Time Settlement (OTS) negotiations</li>
<li style="padding: 6px 0;">💡 Pre-CIRP alternatives exploration</li>
</ul>
</div>

<div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 2px solid #86efac;">
<h4 style="color: #166534; margin-bottom: 12px;">💰 Fundraising Support</h4>
<ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📊 Financial projections & business plans</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📋 Investor documentation (IM, pitch deck)</li>
<li style="padding: 6px 0; border-bottom: 1px dashed #86efac;">📁 Data room management</li>
<li style="padding: 6px 0;">📝 Term sheet & transaction docs review</li>
</ul>
</div>
</div>

<div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #fcd34d;">
<h4 style="color: #92400e; margin-bottom: 12px;">⚖️ Regulatory Advisory</h4>
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">🌍</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #92400e;">FEMA</p>
<p style="margin: 4px 0 0 0; font-size: 12px;">Foreign investment, ECB, RBI filings</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">📈</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #92400e;">SEBI</p>
<p style="margin: 4px 0 0 0; font-size: 12px;">Listed companies, takeover, insider trading</p>
</div>
<div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
<span style="font-size: 24px;">⚖️</span>
<p style="margin: 8px 0 0 0; font-weight: bold; color: #92400e;">Competition Law</p>
<p style="margin: 4px 0 0 0; font-size: 12px;">Merger notifications & compliance</p>
</div>
</div>
</div>

<p style="font-size: 16px; line-height: 1.8; background: linear-gradient(90deg, #1e40af, #7c3aed); color: white; padding: 15px 20px; border-radius: 8px; text-align: center;">Our advisory services combine <strong>technical expertise</strong> with practical business judgment to help you navigate complex decisions with confidence! 💼</p>`,
    subServices: []
  }
];

const seedServices = async (includeImages = false) => {
  try {
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    for (const serviceData of servicesData) {
      const { imageCategory, ...serviceInfo } = serviceData;

      // Optionally fetch images
      if (includeImages) {
        try {
          console.log(`Fetching images for ${serviceInfo.title}...`);
          const images = await getServiceImages(imageCategory, 2);
          if (images.length > 0) {
            serviceInfo.images = images;
            serviceInfo.image = images[0]; // Legacy field
          }

          // Also fetch images for sub-services
          for (let i = 0; i < serviceInfo.subServices.length; i++) {
            console.log(`Fetching images for sub-service: ${serviceInfo.subServices[i].title}...`);
            const subImages = await getServiceImages(imageCategory, 1);
            if (subImages.length > 0) {
              serviceInfo.subServices[i].images = subImages;
            }
          }
        } catch (imgError) {
          console.log(`Could not fetch images: ${imgError.message}`);
        }
      }

      const service = new Service(serviceInfo);
      await service.save();
      console.log(`Created service: ${service.title} (slug: ${service.slug})`);
    }

    console.log('Services seeded successfully');
    console.log(`Total services created: ${servicesData.length}`);
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
};

module.exports = { seedServices, servicesData };
