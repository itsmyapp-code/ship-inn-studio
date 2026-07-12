import { getDocumentBySlug } from 'outstatic/server'

const PAGE_FIELDS = [
  'title', 'slug', 'status', 'coverImage', 'heroImage2', 'heroImage3', 'heroAlt',
  'phone', 'email', 'addressLine1', 'addressLine2', 'town', 'postcode',
  'openingHoursMon', 'openingHoursTue', 'openingHoursWed', 'openingHoursThu', 'openingHoursFri', 'openingHoursSat', 'openingHoursSun',
  'kitchenClose', 'breakfastTimes', 'seasonalNote',
  'foodDrinkIntro1', 'foodDrinkIntro2', 'lagers', 'ciders', 'ales', 'breakfastDescription',
  'strapline', 'introParagraph1', 'introParagraph2', 'introParagraph3', 'introParagraph4', 'introParagraph5',
  'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc', 'feature3Title', 'feature3Desc'
]

export interface PageData {
  title: string
  slug: string
  status: string
  coverImage?: string
  heroImage2?: string
  heroImage3?: string
  heroAlt?: string
  phone?: string
  email?: string
  addressLine1?: string
  addressLine2?: string
  town?: string
  postcode?: string
  openingHoursMon?: string
  openingHoursTue?: string
  openingHoursWed?: string
  openingHoursThu?: string
  openingHoursFri?: string
  openingHoursSat?: string
  openingHoursSun?: string
  kitchenClose?: string
  breakfastTimes?: string
  seasonalNote?: string
  foodDrinkIntro1?: string
  foodDrinkIntro2?: string
  lagers?: string
  ciders?: string
  ales?: string
  breakfastDescription?: string
  strapline?: string
  introParagraph1?: string
  introParagraph2?: string
  introParagraph3?: string
  introParagraph4?: string
  introParagraph5?: string
  feature1Title?: string
  feature1Desc?: string
  feature2Title?: string
  feature2Desc?: string
  feature3Title?: string
  feature3Desc?: string
}

export function getPageData(slug: string): PageData | null {
  try {
    const data = getDocumentBySlug('pages', slug, PAGE_FIELDS)
    if (data && data.status === 'published') {
      return data as PageData
    }
    return null
  } catch (error) {
    console.error(`Error loading page data for ${slug}:`, error)
    return null
  }
}

export function getSharedContactData() {
  const contactPage = getPageData('contact')
  return {
    phone: contactPage?.phone || '01643 863288',
    email: contactPage?.email || 'hello@theshipinnporlockweir.co.uk',
    addressLine1: contactPage?.addressLine1 || 'The Ship Inn',
    addressLine2: contactPage?.addressLine2 || 'Porlock Weir',
    town: contactPage?.town || 'Somerset',
    postcode: contactPage?.postcode || 'TA24 8PB',
    openingHours: {
      monday: contactPage?.openingHoursMon || '11:00 AM - 11:00 PM',
      tuesday: contactPage?.openingHoursTue || '11:00 AM - 11:00 PM',
      wednesday: contactPage?.openingHoursWed || '11:00 AM - 11:00 PM',
      thursday: contactPage?.openingHoursThu || '11:00 AM - 11:00 PM',
      friday: contactPage?.openingHoursFri || '11:00 AM - 11:00 PM',
      saturday: contactPage?.openingHoursSat || '11:00 AM - 11:00 PM',
      sunday: contactPage?.openingHoursSun || '11:00 AM - 11:00 PM',
      kitchenClose: contactPage?.kitchenClose || 'Food served until 9:00 PM',
      breakfastTimes: contactPage?.breakfastTimes || 'Breakfast: 8:30 AM - 10:00 AM',
      seasonalNote: contactPage?.seasonalNote || ''
    }
  }
}
