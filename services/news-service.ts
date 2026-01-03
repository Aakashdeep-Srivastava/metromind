import type { NewsItem, CityMetric } from '@/stores/app-store'

// Free News APIs Configuration
const NEWS_APIS = {
  // GNews API - 100 requests/day free
  gnews: {
    baseUrl: 'https://gnews.io/api/v4',
    key: process.env.NEXT_PUBLIC_GNEWS_API_KEY,
  },
  // NewsData.io - 200 requests/day free
  newsdata: {
    baseUrl: 'https://newsdata.io/api/1',
    key: process.env.NEXT_PUBLIC_NEWSDATA_API_KEY,
  },
}

// Location-based news categories
const NEWS_CATEGORIES = [
  'traffic',
  'weather',
  'local',
  'emergency',
  'events',
  'general',
] as const

// Generate mock news based on location
function generateLocationBasedNews(city: string, district: string): NewsItem[] {
  const now = new Date()
  const categories: NewsItem['category'][] = ['traffic', 'weather', 'local', 'emergency', 'events', 'general']
  const priorities: NewsItem['priority'][] = ['low', 'medium', 'high', 'urgent']

  const newsTemplates = [
    // Traffic
    {
      category: 'traffic' as const,
      templates: [
        { title: `Heavy traffic on ORR near ${district}`, desc: 'Expect 25-30 min delays. Alt route via Sarjapur recommended.' },
        { title: 'Metro Green Line running smoothly', desc: 'All stations operational. Peak hour frequency: 4 mins.' },
        { title: `Road work on MG Road affecting ${district} commuters`, desc: 'Single lane open. Use Residency Road instead.' },
        { title: 'Silk Board Junction congestion easing', desc: 'Traffic normalized after morning peak. Current wait: 8 mins.' },
        { title: `New flyover opens near ${district}`, desc: 'Reduces travel time by 15 mins to Electronic City.' },
      ],
    },
    // Weather
    {
      category: 'weather' as const,
      templates: [
        { title: `Light showers expected in ${district}`, desc: 'Carry umbrella. Clearing by evening.' },
        { title: `AQI Alert: ${city} air quality moderate`, desc: 'AQI: 142. Sensitive groups should limit outdoor activity.' },
        { title: 'Pleasant weather continues', desc: `${city} enjoying 24°C with light breeze. Perfect for outdoor activities.` },
        { title: 'UV Index high today', desc: 'Apply sunscreen if outdoors between 11 AM - 3 PM.' },
        { title: 'Fog advisory for early morning', desc: 'Visibility may drop below 500m. Drive carefully.' },
      ],
    },
    // Local
    {
      category: 'local' as const,
      templates: [
        { title: `New co-working space opens in ${district}`, desc: 'Offers 500 seats with modern amenities. Early bird discounts.' },
        { title: `${district} residents get new park`, desc: '5-acre green space with jogging track and kids play area.' },
        { title: 'BBMP starts pothole repair drive', desc: `${district} roads to be fixed by month-end.` },
        { title: `Smart parking system launches in ${district}`, desc: 'Find parking spots via app. 50% slots now sensor-enabled.' },
        { title: 'Water supply schedule updated', desc: `${district} timings changed to 6-8 AM and 6-8 PM.` },
      ],
    },
    // Emergency
    {
      category: 'emergency' as const,
      templates: [
        { title: `Fire station drill in ${district}`, desc: 'Mock emergency response today. Expect sirens 2-4 PM.' },
        { title: 'Power outage scheduled', desc: `Maintenance in ${district}. Backup advised for 10 AM - 2 PM.` },
        { title: 'Gas leak contained in Indiranagar', desc: 'Area safe. Residents can return. GAIL teams on site.' },
        { title: 'Tree fall cleared on main road', desc: 'Traffic restored in 30 mins. No injuries reported.' },
      ],
    },
    // Events
    {
      category: 'events' as const,
      templates: [
        { title: `Weekend market at ${district}`, desc: 'Local artisans, food stalls. Saturday 10 AM - 8 PM.' },
        { title: 'Tech meetup at Koramangala', desc: 'AI & ML workshop. Free entry with registration.' },
        { title: 'IPL match traffic advisory', desc: 'Chinnaswamy area congested 4-11 PM. Use metro.' },
        { title: 'Food festival this weekend', desc: `${district} hosts cuisines from 15 states. Entry free.` },
        { title: 'Marathon route affects traffic', desc: 'Cubbon Park to MG Road closed Sunday 5-10 AM.' },
      ],
    },
    // General
    {
      category: 'general' as const,
      templates: [
        { title: `${city} ranks #3 in startup ecosystem`, desc: 'New report highlights tech hub growth. 45K+ startups active.' },
        { title: 'Metro Phase 3 progress update', desc: '60% complete. Airport line expected by 2026.' },
        { title: `${city} to get 100 e-buses`, desc: 'Green initiative to reduce emissions by 30%.' },
        { title: 'Digital payment adoption at 92%', desc: `${city} leads in UPI transactions among Indian cities.` },
        { title: 'New IT park announced', desc: `12-acre campus near ${district}. 20,000 jobs expected.` },
      ],
    },
  ]

  const news: NewsItem[] = []

  newsTemplates.forEach((categoryData, catIndex) => {
    categoryData.templates.forEach((template, idx) => {
      const hoursAgo = Math.floor(Math.random() * 12)
      const minsAgo = Math.floor(Math.random() * 60)
      const timestamp = new Date(now.getTime() - (hoursAgo * 60 + minsAgo) * 60 * 1000)

      news.push({
        id: `news-${catIndex}-${idx}-${Date.now()}`,
        title: template.title,
        description: template.desc,
        source: ['TOI Bengaluru', 'Deccan Herald', 'Bangalore Mirror', 'The Hindu', 'Indian Express'][Math.floor(Math.random() * 5)],
        category: categoryData.category,
        timestamp,
        location: district,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
      })
    })
  })

  // Sort by timestamp (newest first) and add some randomization
  return news.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Fetch news from GNews API
async function fetchFromGNews(query: string): Promise<NewsItem[]> {
  if (!NEWS_APIS.gnews.key) return []

  try {
    const response = await fetch(
      `${NEWS_APIS.gnews.baseUrl}/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=10&apikey=${NEWS_APIS.gnews.key}`
    )

    if (!response.ok) throw new Error('GNews API failed')

    const data = await response.json()

    return (data.articles || []).map((article: any, idx: number) => ({
      id: `gnews-${idx}-${Date.now()}`,
      title: article.title,
      description: article.description || '',
      source: article.source?.name || 'News',
      category: 'general' as const,
      timestamp: new Date(article.publishedAt),
      url: article.url,
      imageUrl: article.image,
      priority: 'medium' as const,
    }))
  } catch (error) {
    console.warn('GNews API error:', error)
    return []
  }
}

// Fetch news from NewsData.io
async function fetchFromNewsData(query: string): Promise<NewsItem[]> {
  if (!NEWS_APIS.newsdata.key) return []

  try {
    const response = await fetch(
      `${NEWS_APIS.newsdata.baseUrl}/news?apikey=${NEWS_APIS.newsdata.key}&q=${encodeURIComponent(query)}&country=in&language=en`
    )

    if (!response.ok) throw new Error('NewsData API failed')

    const data = await response.json()

    return (data.results || []).map((article: any, idx: number) => ({
      id: `newsdata-${idx}-${Date.now()}`,
      title: article.title,
      description: article.description || '',
      source: article.source_id || 'News',
      category: 'general' as const,
      timestamp: new Date(article.pubDate),
      url: article.link,
      imageUrl: article.image_url,
      priority: 'medium' as const,
    }))
  } catch (error) {
    console.warn('NewsData API error:', error)
    return []
  }
}

// Main function to fetch location-based news
export async function fetchLocationNews(
  city: string,
  district: string
): Promise<NewsItem[]> {
  const query = `${city} ${district} news`

  // Try fetching from APIs
  const [gnewsResults, newsdataResults] = await Promise.all([
    fetchFromGNews(query),
    fetchFromNewsData(query),
  ])

  // Combine API results
  let news = [...gnewsResults, ...newsdataResults]

  // If no API results, use generated mock data
  if (news.length === 0) {
    news = generateLocationBasedNews(city, district)
  }

  return news.slice(0, 30) // Limit to 30 items
}

// Generate city metrics based on location
export function generateCityMetrics(city: string): CityMetric[] {
  return [
    {
      id: 'aqi',
      label: 'Air Quality',
      value: Math.floor(Math.random() * 100) + 80,
      unit: 'AQI',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.floor(Math.random() * 15),
      icon: 'Wind',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'traffic',
      label: 'Traffic Index',
      value: Math.floor(Math.random() * 40) + 40,
      unit: '%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.floor(Math.random() * 10),
      icon: 'Car',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'temp',
      label: 'Temperature',
      value: Math.floor(Math.random() * 10) + 22,
      unit: '°C',
      trend: 'stable',
      change: 0,
      icon: 'Thermometer',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: Math.floor(Math.random() * 30) + 50,
      unit: '%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.floor(Math.random() * 5),
      icon: 'Droplets',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: Math.floor(Math.random() * 5) + 2,
      trend: 'stable',
      icon: 'Bell',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'reports',
      label: 'Reports Today',
      value: Math.floor(Math.random() * 50) + 20,
      trend: 'up',
      change: Math.floor(Math.random() * 20),
      icon: 'FileText',
      color: 'from-indigo-500 to-purple-500',
    },
  ]
}

// Fetch weather data from Open-Meteo (free, no API key required)
export async function fetchWeather(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    )

    if (!response.ok) throw new Error('Weather API failed')

    const data = await response.json()
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      feelsLike: data.current.apparent_temperature,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
    }
  } catch (error) {
    console.warn('Weather API error:', error)
    return null
  }
}

// Fetch air quality from Open-Meteo (free)
export async function fetchAirQuality(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide&timezone=auto`
    )

    if (!response.ok) throw new Error('AQI API failed')

    const data = await response.json()
    return {
      aqi: data.current.european_aqi,
      pm25: data.current.pm2_5,
      pm10: data.current.pm10,
      co: data.current.carbon_monoxide,
      no2: data.current.nitrogen_dioxide,
    }
  } catch (error) {
    console.warn('AQI API error:', error)
    return null
  }
}
