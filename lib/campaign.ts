export const campaign = {
  title: 'SAVE A LIFE',
  heading: 'Help Our Dear Colleague Receive a Life-Saving Kidney Transplant',
  supporting:
    'Our colleague urgently needs a kidney transplant. Your support can help provide a second chance at life.',
  shareUrl: 'https://adebolacaxtonmartins.xyz',
  shareText:
    'Help our dear colleague receive a life-saving kidney transplant. Every donation brings hope. Please support and share this appeal. 🙏',

  beneficiary: {
    fullName: 'Caxton-Martins Adebola',
    department: 'Lagos State Social Worker',
    yearsOfService: '16 Years of Service',
  },

  bank: {
    name: 'GTBank',
    accountName: 'Caxton-Martins Adebola',
    accountNumber: '0122475046',
  },

  funds: {
    target: 45_000_000,
    raised: 500_000,
    donors: 2,
    shares: 0,
  },

  contact: {
    email: 'adebolahunter@gmail.com',
    phone: '+234 000 000 0000',
  },
}

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString('en-NG')}`
