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

  // Universal templates that work for any location
  const locationCity = city || 'Your City'
  const locationDistrict = district || 'Your Area'

  const newsTemplates = [
    // Traffic
    {
      category: 'traffic' as const,
      templates: [
        { title: `Heavy traffic reported near ${locationDistrict}`, desc: 'Expect 20-30 min delays. Consider alternate routes.' },
        { title: 'Public transit running on schedule', desc: 'All lines operational. Peak hour frequency normal.' },
        { title: `Road construction in ${locationDistrict} area`, desc: 'Lane closures in effect. Plan extra travel time.' },
        { title: 'Main junction traffic clearing', desc: 'Flow normalizing after morning rush hour.' },
        { title: `New route opens near ${locationDistrict}`, desc: 'Expected to reduce commute times for residents.' },
      ],
    },
    // Weather
    {
      category: 'weather' as const,
      templates: [
        { title: `Weather update for ${locationDistrict}`, desc: 'Check forecast before heading out today.' },
        { title: `Air Quality Alert: ${locationCity}`, desc: 'Monitor AQI levels. Take precautions if sensitive.' },
        { title: `${locationCity} weather favorable`, desc: 'Comfortable conditions. Good for outdoor activities.' },
        { title: 'UV levels elevated today', desc: 'Sun protection recommended if outdoors.' },
        { title: 'Visibility advisory', desc: 'Reduced visibility possible. Drive with caution.' },
      ],
    },
    // Local
    {
      category: 'local' as const,
      templates: [
        { title: `New business opens in ${locationDistrict}`, desc: 'Local economy growing with new establishments.' },
        { title: `${locationDistrict} community improvements`, desc: 'New facilities being added for residents.' },
        { title: `Infrastructure upgrades in ${locationDistrict}`, desc: 'Roads and utilities being modernized.' },
        { title: `Smart city initiative in ${locationCity}`, desc: 'Digital services expanding across the area.' },
        { title: 'Utility schedule update', desc: `${locationDistrict} service timings adjusted.` },
      ],
    },
    // Emergency
    {
      category: 'emergency' as const,
      templates: [
        { title: `Safety drill in ${locationDistrict}`, desc: 'Emergency response exercise planned.' },
        { title: 'Scheduled maintenance', desc: `Brief service interruption in ${locationDistrict}.` },
        { title: 'Incident resolved', desc: 'Emergency services responded promptly. Area clear.' },
        { title: 'Road hazard cleared', desc: 'Traffic flow restored. No injuries reported.' },
      ],
    },
    // Events
    {
      category: 'events' as const,
      templates: [
        { title: `Community event in ${locationDistrict}`, desc: 'Local gathering this weekend. All welcome.' },
        { title: `${locationCity} cultural festival`, desc: 'Celebrating local heritage and traditions.' },
        { title: 'Sports event traffic advisory', desc: 'Expect crowds near venue. Use public transit.' },
        { title: `Food & entertainment in ${locationDistrict}`, desc: 'Local vendors showcase specialties.' },
        { title: 'Charity run this weekend', desc: 'Some roads may have temporary closures.' },
      ],
    },
    // General
    {
      category: 'general' as const,
      templates: [
        { title: `${locationCity} development update`, desc: 'City continues growth with new investments.' },
        { title: 'Public transit expansion', desc: 'New routes to improve city connectivity.' },
        { title: `${locationCity} sustainability initiative`, desc: 'Green programs launching to improve environment.' },
        { title: 'Digital services expanding', desc: `${locationCity} enhancing online civic services.` },
        { title: `Economic opportunity in ${locationDistrict}`, desc: 'New developments creating jobs.' },
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
        source: ['Local News', 'City Times', 'Metro Daily', 'Urban Report', 'City Pulse'][Math.floor(Math.random() * 5)],
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
