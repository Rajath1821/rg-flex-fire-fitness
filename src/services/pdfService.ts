import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Member } from '../types';
import { calculateDaysRemaining } from './storage';

function computeAge(dobStr: string): number {
  if (!dobStr) return 0;
  const birth = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age > 0 ? age : 0;
}

function getBmiCategory(bmi: number): string {
  if (!bmi || isNaN(bmi)) return 'N/A';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function escapeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).trim();
  return `"${str.replace(/"/g, '""')}"`;
}

async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateMemberDetailsPDF(member: Member): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background Header Banner
  doc.setFillColor(15, 23, 33);
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Neon accent strip
  doc.setFillColor(0, 255, 102);
  doc.rect(0, 44, pageWidth, 2.5, 'F');

  // Logo Icon Box
  doc.setFillColor(0, 255, 102);
  doc.roundedRect(14, 10, 15, 15, 2, 2, 'F');
  doc.setTextColor(10, 15, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RG', 16.5, 20);

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('RG FLEX FIRE FITNESS', 33, 18);

  doc.setTextColor(0, 255, 102);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('#64, MIG 1st Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore', 33, 24);

  doc.setTextColor(160, 174, 192);
  doc.setFontSize(8);
  doc.text('CONTACT: Sachin R (9964671267) | Kiran R (9164557180) | Krupa Sagar (9148640684)', 33, 29);

  // Document metadata on top right
  doc.setTextColor(200, 210, 220);
  doc.setFontSize(8);
  doc.text(`DOC REF: RG-REC-${member.id.replace(/\D/g, '') || '01'}`, pageWidth - 14, 16, { align: 'right' });
  doc.text(`DATE: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}`, pageWidth - 14, 21, { align: 'right' });

  // Status Badge in header
  const isPaid = member.paymentStatus === 'Paid';
  doc.setFillColor(isPaid ? 16 : 220, isPaid ? 185 : 38, isPaid ? 129 : 38);
  doc.roundedRect(pageWidth - 45, 26, 31, 7, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(member.status.toUpperCase(), pageWidth - 29.5, 30.5, { align: 'center' });

  const startY = 54;

  // Profile Section Banner
  doc.setFillColor(245, 248, 250);
  doc.roundedRect(14, startY, pageWidth - 28, 38, 2, 2, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, startY, pageWidth - 28, 38, 2, 2, 'S');

  // Try loading member photo
  let imageAdded = false;
  if (member.photoUrl) {
    try {
      const base64Data = await getBase64ImageFromUrl(member.photoUrl);
      if (base64Data) {
        doc.addImage(base64Data, 'JPEG', 18, startY + 4, 30, 30);
        imageAdded = true;
      }
    } catch {
      imageAdded = false;
    }
  }

  if (!imageAdded) {
    doc.setFillColor(220, 228, 236);
    doc.roundedRect(18, startY + 4, 30, 30, 2, 2, 'F');
    doc.setTextColor(70, 80, 95);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const initials = member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
    doc.text(initials, 33, startY + 21, { align: 'center' });
    doc.setFontSize(7);
    doc.text('PHOTO', 33, startY + 26, { align: 'center' });
  }

  // Member Quick Highlights beside photo
  const infoX = 54;
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(member.fullName.toUpperCase(), infoX, startY + 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 130, 60);
  doc.text(`MEMBER ID: ${member.id}`, infoX, startY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8.5);
  doc.text(`PLAN: ${member.plan.toUpperCase()}   |   JOINED: ${member.joiningDate}`, infoX, startY + 24);
  doc.text(`VALIDITY: ${member.startDate}  TO  ${member.expiryDate}`, infoX, startY + 29);
  doc.text(`PAYMENT STATUS: ${member.paymentStatus.toUpperCase()} (Rs. ${member.amount}/-)`, infoX, startY + 34);

  // Table 1: Personal & Contact Information
  const t1Y = 98;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 33);
  doc.text('1. ATHLETE PERSONAL & CONTACT DETAILS', 14, t1Y);

  autoTable(doc, {
    startY: t1Y + 2,
    head: [['Field', 'Information', 'Field', 'Information']],
    body: [
      ['Full Name', member.fullName, 'Member ID', member.id],
      ['Date of Birth', member.dob, 'Gender', member.gender],
      ['Email Address', member.email, 'Phone Number', member.phone],
      ['Residential Address', member.address, 'Emergency Contact', `${member.emergencyContact.name} (${member.emergencyContact.relation}) - ${member.emergencyContact.phone}`],
    ],
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 3, textColor: [30, 41, 59] },
    headStyles: { fillColor: [15, 23, 33], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 38, fillColor: [248, 250, 252] },
      1: { cellWidth: 55 },
      2: { fontStyle: 'bold', cellWidth: 38, fillColor: [248, 250, 252] },
      3: { cellWidth: 51 },
    },
    margin: { left: 14, right: 14 },
  });

  // Table 2: Physical & Biometric Information
  const lastTableY1 = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 33);
  doc.text('2. PHYSICAL & BIOMETRIC PROFILE', 14, lastTableY1);

  const bmiCategory = member.bmi < 18.5 ? 'Underweight' : member.bmi < 25 ? 'Normal weight' : member.bmi < 30 ? 'Overweight' : 'Obese';

  autoTable(doc, {
    startY: lastTableY1 + 2,
    head: [['Parameter', 'Recorded Value', 'Notes / Recommendations']],
    body: [
      ['Height', `${member.height} cm`, 'Recorded standing height'],
      ['Weight', `${member.weight} kg`, 'Calibrated gym scale reading'],
      ['Body Mass Index (BMI)', `${member.bmi} kg/m²`, `Classification: ${bmiCategory}`],
      ['Fitness Goals', member.fitnessGoals || 'Strength & conditioning', 'Assigned routine by Sachin / Kiran sir'],
      ['Medical / Health Notes', member.medicalNotes || 'No restrictions. Cleared for heavy lifting.', 'Form coaching provided'],
    ],
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 3, textColor: [30, 41, 59] },
    headStyles: { fillColor: [15, 23, 33], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 46, fillColor: [248, 250, 252] },
      1: { cellWidth: 45 },
      2: { cellWidth: 91 },
    },
    margin: { left: 14, right: 14 },
  });

  // Table 3: Membership Subscription & Payment Details
  const lastTableY2 = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 33);
  doc.text('3. MEMBERSHIP PACKAGE & PAYMENT RECORD', 14, lastTableY2);

  autoTable(doc, {
    startY: lastTableY2 + 2,
    head: [['Subscription Item', 'Details', 'Item', 'Details']],
    body: [
      ['Package Plan', member.plan, 'Joining Date', member.joiningDate],
      ['Coverage Start Date', member.startDate, 'Coverage Expiry Date', member.expiryDate],
      ['Package Fee Amount', `Rs. ${member.amount}/- INR`, 'Payment Status', member.paymentStatus.toUpperCase()],
      ['Facility Center', 'RG FLEX FIRE FITNESS (Mysore)', 'Access Pass', 'Digital QR & NFC Key'],
    ],
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 3, textColor: [30, 41, 59] },
    headStyles: { fillColor: [15, 23, 33], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, fillColor: [248, 250, 252] },
      1: { cellWidth: 51 },
      2: { fontStyle: 'bold', cellWidth: 42, fillColor: [248, 250, 252] },
      3: { cellWidth: 47 },
    },
    margin: { left: 14, right: 14 },
  });

  // Authorization Signatures & Official Stamp
  const sigY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setDrawColor(0, 180, 80);
  doc.setLineWidth(0.8);
  doc.circle(pageWidth / 2, sigY + 11, 10, 'S');
  doc.setTextColor(0, 150, 60);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('RG FLEX FIRE', pageWidth / 2, sigY + 9, { align: 'center' });
  doc.text('VERIFIED', pageWidth / 2, sigY + 12, { align: 'center' });
  doc.text('FITNESS', pageWidth / 2, sigY + 15, { align: 'center' });

  doc.setDrawColor(180, 190, 200);
  doc.setLineWidth(0.3);
  doc.line(20, sigY + 16, 75, sigY + 16);
  doc.setTextColor(100, 110, 120);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Member Digital Signature', 47.5, sigY + 20, { align: 'center' });

  doc.line(pageWidth - 75, sigY + 16, pageWidth - 20, sigY + 16);
  doc.text('Authorized Signature (Sachin / Kiran R)', pageWidth - 47.5, sigY + 20, { align: 'center' });

  // Footer bar
  doc.setFillColor(15, 23, 33);
  doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');
  doc.setFillColor(0, 255, 102);
  doc.rect(0, pageHeight - 14, pageWidth, 1, 'F');

  doc.setTextColor(180, 190, 200);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('RG FLEX FIRE FITNESS • #64, MIG 1st Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore • 9964671267', 14, pageHeight - 6);
  doc.text(`ID: ${member.id} • OFFICIAL RECORD`, pageWidth - 14, pageHeight - 6, { align: 'right' });

  const filename = `RGFLEXFIRE_${member.id.replace(/[^a-zA-Z0-9_-]/g, '_')}_MemberDetails.pdf`;
  doc.save(filename);
}

export function exportMembersToCSV(members: Member[]): void {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalMembers = members.length;
  const activeCount = members.filter(m => m.status === 'Active').length;
  const expiringCount = members.filter(m => m.status === 'Expiring Soon').length;
  const expiredCount = members.filter(m => m.status === 'Expired').length;
  const totalRevenue = members.reduce((sum, m) => sum + (m.paymentStatus === 'Paid' ? m.amount : 0), 0);
  const pendingCount = members.filter(m => m.paymentStatus === 'Pending').length;

  // Executive Top Banner Lines
  const bannerLines = [
    escapeCSV('========================================================================================================================'),
    escapeCSV('RG FLEX FIRE FITNESS – SMART GYM MANAGEMENT SYSTEM (MYSORE)'),
    escapeCSV('LOCATION: #64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore - 570016'),
    escapeCSV('COACHES & INQUIRY HOTLINE: Sachin R (9964671267) | Kiran R (9164557180) | Krupa Sagar (9148640684)'),
    escapeCSV('OFFICIAL MASTER MEMBER DIRECTORY & MEMBERSHIP FINANCIAL LEDGER'),
    escapeCSV(`GENERATED ON: ${dateFormatted} at ${timeFormatted}`),
    escapeCSV(`EXECUTIVE SUMMARY: Total Registered: ${totalMembers} | Active: ${activeCount} | Expiring Soon: ${expiringCount} | Expired: ${expiredCount} | Total Revenue: Rs. ${totalRevenue.toLocaleString('en-IN')}/- INR | Pending Dues: ${pendingCount}`),
    escapeCSV('========================================================================================================================'),
    '""'
  ];

  // 26 Structured, Fully Labeled Data Headers
  const headers = [
    'SL NO',
    'MEMBER ID',
    'FULL NAME',
    'GENDER',
    'DATE OF BIRTH',
    'AGE (YRS)',
    'PHONE NUMBER',
    'EMAIL ADDRESS',
    'RESIDENTIAL ADDRESS',
    'HEIGHT (CM)',
    'WEIGHT (KG)',
    'BMI (KG/M²)',
    'BMI CLASSIFICATION',
    'MEMBERSHIP PACKAGE',
    'PACKAGE FEE (INR)',
    'PAYMENT STATUS',
    'MEMBERSHIP STATUS',
    'DAYS REMAINING',
    'JOINING DATE',
    'COVERAGE START',
    'COVERAGE EXPIRY',
    'EMERGENCY CONTACT NAME',
    'EMERGENCY CONTACT PHONE',
    'RELATIONSHIP',
    'FITNESS GOALS & ROUTINE',
    'MEDICAL NOTES & CLEARANCE'
  ];

  // Data Rows
  const rows = members.map((m, idx) => {
    const days = calculateDaysRemaining(m.expiryDate);
    const daysText = days > 0 ? `${days} Days Left` : days === 0 ? 'Expires Today' : `${Math.abs(days)} Days Expired`;
    const cleanPhone = m.phone ? (m.phone.startsWith('+91') ? m.phone : `+91 ${m.phone}`) : 'N/A';
    const cleanEmergencyPhone = m.emergencyContact.phone ? (m.emergencyContact.phone.startsWith('+91') ? m.emergencyContact.phone : `+91 ${m.emergencyContact.phone}`) : 'N/A';

    return [
      idx + 1,
      escapeCSV(m.id),
      escapeCSV(m.fullName),
      escapeCSV(m.gender),
      escapeCSV(m.dob),
      computeAge(m.dob),
      escapeCSV(cleanPhone),
      escapeCSV(m.email),
      escapeCSV(m.address),
      m.height,
      m.weight,
      m.bmi,
      escapeCSV(getBmiCategory(m.bmi)),
      escapeCSV(m.plan),
      escapeCSV(`₹ ${m.amount.toLocaleString('en-IN')}`),
      escapeCSV(m.paymentStatus.toUpperCase()),
      escapeCSV(m.status.toUpperCase()),
      escapeCSV(daysText),
      escapeCSV(m.joiningDate),
      escapeCSV(m.startDate),
      escapeCSV(m.expiryDate),
      escapeCSV(m.emergencyContact.name),
      escapeCSV(cleanEmergencyPhone),
      escapeCSV(m.emergencyContact.relation),
      escapeCSV(m.fitnessGoals || 'General Fitness'),
      escapeCSV(m.medicalNotes || 'Fit & Cleared')
    ].join(',');
  });

  // Financial Audit Summary Footer Lines
  const footerLines = [
    '""',
    escapeCSV('========================================================================================================================'),
    escapeCSV('SUMMARY FINANCIAL & ENROLLMENT AUDIT LEDGER'),
    [
      escapeCSV('TOTAL MEMBERS:'),
      totalMembers,
      '""', '""', '""', '""', '""', '""', '""', '""', '""', '""', '""',
      escapeCSV('TOTAL PAID REVENUE:'),
      escapeCSV(`₹ ${totalRevenue.toLocaleString('en-IN')}`),
      '""', '""', '""', '""', '""', '""', '""', '""', '""', '""', '""'
    ].join(','),
    [
      escapeCSV('ACTIVE MEMBERS:'),
      activeCount,
      '""', '""', '""', '""', '""', '""', '""', '""', '""', '""', '""',
      escapeCSV('EXPIRING SOON:'),
      expiringCount,
      '""',
      escapeCSV('EXPIRED:'),
      expiredCount,
      '""', '""', '""', '""', '""', '""', '""', '""'
    ].join(','),
    escapeCSV('========================================================================================================================'),
    escapeCSV('CONFIDENTIAL RECORD: RG FLEX FIRE FITNESS • Lakshmikant Nagara, Hebbal 1st Stage, Mysore • Proprietary & Confidential')
  ];

  // Prepend UTF-8 Byte Order Mark (\uFEFF) so Microsoft Excel natively displays ₹ symbol and all formatting cleanly
  const csvString = '\uFEFF' + [
    ...bannerLines,
    headers.map(escapeCSV).join(','),
    ...rows,
    ...footerLines
  ].join('\r\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `RGFLEXFIRE_Master_Members_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportMembersToExcel(members: Member[]): void {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalMembers = members.length;
  const activeCount = members.filter(m => m.status === 'Active').length;
  const expiringCount = members.filter(m => m.status === 'Expiring Soon').length;
  const expiredCount = members.filter(m => m.status === 'Expired').length;
  const totalRevenue = members.reduce((sum, m) => sum + (m.paymentStatus === 'Paid' ? m.amount : 0), 0);

  const tableRowsHtml = members.map((m, idx) => {
    const days = calculateDaysRemaining(m.expiryDate);
    const daysText = days > 0 ? `${days} Days Left` : days === 0 ? 'Expires Today' : `${Math.abs(days)} Days Expired`;
    const cleanPhone = m.phone ? (m.phone.startsWith('+91') ? m.phone : `+91 ${m.phone}`) : 'N/A';
    const cleanEmergencyPhone = m.emergencyContact.phone ? (m.emergencyContact.phone.startsWith('+91') ? m.emergencyContact.phone : `+91 ${m.emergencyContact.phone}`) : 'N/A';

    const statusBg = m.status === 'Active' ? '#DCFCE7' : m.status === 'Expiring Soon' ? '#FEF3C7' : '#FEE2E2';
    const statusText = m.status === 'Active' ? '#166534' : m.status === 'Expiring Soon' ? '#92400E' : '#991B1B';

    const payBg = m.paymentStatus === 'Paid' ? '#DCFCE7' : m.paymentStatus === 'Pending' ? '#FEF3C7' : '#FEE2E2';
    const payText = m.paymentStatus === 'Paid' ? '#166534' : m.paymentStatus === 'Pending' ? '#92400E' : '#991B1B';

    const rowBg = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

    return `
      <tr style="background-color: ${rowBg};">
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px;">${idx + 1}</td>
        <td style="font-weight: bold; border: 1px solid #CBD5E1; padding: 8px; color: #0284C7;">${m.id}</td>
        <td style="font-weight: bold; border: 1px solid #CBD5E1; padding: 8px; color: #0F172A;">${m.fullName}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px;">${m.gender}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px;">${m.dob}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px;">${computeAge(m.dob)}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; mso-number-format:'\\@';">${cleanPhone}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${m.email}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${m.address}</td>
        <td style="text-align: right; border: 1px solid #CBD5E1; padding: 8px;">${m.height} cm</td>
        <td style="text-align: right; border: 1px solid #CBD5E1; padding: 8px;">${m.weight} kg</td>
        <td style="text-align: right; font-weight: bold; border: 1px solid #CBD5E1; padding: 8px;">${m.bmi}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${getBmiCategory(m.bmi)}</td>
        <td style="font-weight: bold; border: 1px solid #CBD5E1; padding: 8px;">${m.plan}</td>
        <td style="text-align: right; font-weight: bold; border: 1px solid #CBD5E1; padding: 8px; color: #059669;">₹ ${m.amount.toLocaleString('en-IN')}</td>
        <td style="text-align: center; background-color: ${payBg}; color: ${payText}; font-weight: bold; border: 1px solid #CBD5E1; padding: 8px;">${m.paymentStatus.toUpperCase()}</td>
        <td style="text-align: center; background-color: ${statusBg}; color: ${statusText}; font-weight: bold; border: 1px solid #CBD5E1; padding: 8px;">${m.status.toUpperCase()}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px; font-weight: 500;">${daysText}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px;">${m.joiningDate}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px;">${m.startDate}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; padding: 8px; font-weight: bold;">${m.expiryDate}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${m.emergencyContact.name}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; mso-number-format:'\\@';">${cleanEmergencyPhone}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${m.emergencyContact.relation}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${m.fitnessGoals || 'General Fitness'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${m.medicalNotes || 'Fit & Cleared'}</td>
      </tr>
    `;
  }).join('');

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>RG Flex Fire Members</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #0F172A; color: #00FF66; font-size: 11px; text-transform: uppercase; border: 1px solid #334155; padding: 10px 8px; text-align: left; }
        td { font-size: 11px; }
      </style>
    </head>
    <body style="background-color: #F8FAFC; padding: 20px;">
      
      <!-- Organization Header Banner -->
      <table style="margin-bottom: 20px; border: none;">
        <tr>
          <td colspan="26" style="background-color: #0B0F17; color: #00FF66; font-size: 20px; font-weight: bold; padding: 16px; border-bottom: 3px solid #00FF66;">
            RG FLEX FIRE FITNESS – SMART GYM MANAGEMENT SYSTEM (MYSORE)
          </td>
        </tr>
        <tr>
          <td colspan="26" style="background-color: #1E293B; color: #E2E8F0; font-size: 12px; padding: 8px 16px;">
            <strong>LOCATION:</strong> #64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore - 570016
          </td>
        </tr>
        <tr>
          <td colspan="26" style="background-color: #1E293B; color: #94A3B8; font-size: 12px; padding: 4px 16px 12px 16px;">
            <strong>DIRECT COACHES:</strong> Sachin R (9964671267) | Kiran R (9164557180) | Krupa Sagar (9148640684) &nbsp;|&nbsp; 
            <strong>GENERATED:</strong> ${dateFormatted} at ${timeFormatted}
          </td>
        </tr>
      </table>

      <!-- Executive KPI Cards Grid -->
      <table style="margin-bottom: 20px; border: none;">
        <tr>
          <td colspan="5" style="background-color: #FFFFFF; border: 2px solid #E2E8F0; padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Total Registered</div>
            <div style="font-size: 22px; font-weight: bold; color: #0F172A;">${totalMembers} Athletes</div>
          </td>
          <td colspan="5" style="background-color: #ECFDF5; border: 2px solid #A7F3D0; padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: #047857; text-transform: uppercase;">Active Members</div>
            <div style="font-size: 22px; font-weight: bold; color: #065F46;">${activeCount}</div>
          </td>
          <td colspan="5" style="background-color: #FFFBEB; border: 2px solid #FDE68A; padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: #B45309; text-transform: uppercase;">Expiring Soon (&lt;7d)</div>
            <div style="font-size: 22px; font-weight: bold; color: #92400E;">${expiringCount}</div>
          </td>
          <td colspan="5" style="background-color: #FEF2F2; border: 2px solid #FECACA; padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: #B91C1C; text-transform: uppercase;">Expired</div>
            <div style="font-size: 22px; font-weight: bold; color: #991B1B;">${expiredCount}</div>
          </td>
          <td colspan="6" style="background-color: #F0FDF4; border: 2px solid #86EFAC; padding: 12px; border-radius: 8px;">
            <div style="font-size: 11px; color: #15803D; text-transform: uppercase;">Total Collections</div>
            <div style="font-size: 22px; font-weight: bold; color: #166534;">₹ ${totalRevenue.toLocaleString('en-IN')}</div>
          </td>
        </tr>
      </table>

      <!-- Main Data Table -->
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">SL NO</th>
            <th style="width: 100px;">MEMBER ID</th>
            <th style="width: 160px;">FULL NAME</th>
            <th style="width: 70px; text-align: center;">GENDER</th>
            <th style="width: 90px; text-align: center;">DOB</th>
            <th style="width: 60px; text-align: center;">AGE</th>
            <th style="width: 130px;">PHONE NUMBER</th>
            <th style="width: 180px;">EMAIL</th>
            <th style="width: 250px;">RESIDENTIAL ADDRESS</th>
            <th style="width: 90px; text-align: right;">HEIGHT</th>
            <th style="width: 90px; text-align: right;">WEIGHT</th>
            <th style="width: 70px; text-align: right;">BMI</th>
            <th style="width: 110px;">BMI CATEGORY</th>
            <th style="width: 180px;">PACKAGE PLAN</th>
            <th style="width: 110px; text-align: right;">PACKAGE FEE</th>
            <th style="width: 100px; text-align: center;">PAYMENT</th>
            <th style="width: 110px; text-align: center;">STATUS</th>
            <th style="width: 110px; text-align: center;">DAYS LEFT</th>
            <th style="width: 100px; text-align: center;">JOINING DATE</th>
            <th style="width: 100px; text-align: center;">START DATE</th>
            <th style="width: 100px; text-align: center;">EXPIRY DATE</th>
            <th style="width: 140px;">EMERGENCY CONTACT</th>
            <th style="width: 130px;">EMERGENCY PHONE</th>
            <th style="width: 110px;">RELATION</th>
            <th style="width: 200px;">FITNESS GOALS</th>
            <th style="width: 200px;">MEDICAL NOTES</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
        <tfoot>
          <tr style="background-color: #0F172A; color: #FFFFFF; font-weight: bold; border-top: 2px solid #00FF66;">
            <td colspan="14" style="padding: 12px; font-size: 12px; color: #00FF66;">TOTAL AUDIT LEDGER (${totalMembers} Active Records)</td>
            <td style="padding: 12px; font-size: 13px; text-align: right; color: #00FF66;">₹ ${totalRevenue.toLocaleString('en-IN')}</td>
            <td colspan="11" style="padding: 12px; font-size: 11px; text-align: right; color: #94A3B8;">CONFIDENTIAL GYM RECORDS</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 20px; font-size: 11px; color: #64748B; text-align: center;">
        RG FLEX FIRE FITNESS • #64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore • Coaches: Sachin R (9964671267), Kiran R (9164557180), Krupa Sagar (9148640684)
      </div>

    </body>
    </html>
  `;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `RGFLEXFIRE_Members_Ledger_${new Date().toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
