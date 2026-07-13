import { getDocumentBySlug } from 'outstatic/server'

const PAGE_FIELDS = [
  'title', 'slug', 'status', 'coverImage', 'heroImageOne', 'heroImageTwo', 'heroImageThree', 'heroAlt',
  'phone', 'email', 'addressLineOne', 'addressLineTwo', 'town', 'postcode',
  'openingHoursMon', 'openingHoursTue', 'openingHoursWed', 'openingHoursThu', 'openingHoursFri', 'openingHoursSat', 'openingHoursSun',
  'kitchenClose', 'breakfastTimes', 'seasonalNote',
  'foodDrinkIntroOne', 'foodDrinkIntroTwo', 'lagers', 'ciders', 'ales', 'breakfastDescription',
  'strapline', 'introParagraphOne', 'introParagraphTwo', 'introParagraphThree', 'introParagraphFour', 'introParagraphFive',
  'featureOneTitle', 'featureOneDesc', 'featureTwoTitle', 'featureTwoDesc', 'featureThreeTitle', 'featureThreeDesc'
]

export interface PageData {
  title: string
  slug: string
  status: string
  coverImage?: string
  heroImageOne?: string
  heroImageTwo?: string
  heroImageThree?: string
  heroAlt?: string
  phone?: string
  email?: string
  addressLineOne?: string
  addressLineTwo?: string
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
  foodDrinkIntroOne?: string
  foodDrinkIntroTwo?: string
  lagers?: string
  ciders?: string
  ales?: string
  breakfastDescription?: string
  strapline?: string
  introParagraphOne?: string
  introParagraphTwo?: string
  introParagraphThree?: string
  introParagraphFour?: string
  introParagraphFive?: string
  featureOneTitle?: string
  featureOneDesc?: string
  featureTwoTitle?: string
  featureTwoDesc?: string
  featureThreeTitle?: string
  featureThreeDesc?: string
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
    addressLine1: contactPage?.addressLineOne || 'The Ship Inn',
    addressLine2: contactPage?.addressLineTwo || 'Porlock Weir',
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
