/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
	changefreq: 'weekly',
  priority: 0.7,
	transform: async (config, path) => {
    let priority = config.priority // default priority => 0.5
    let changefreq = config.changefreq // default changefreq => 'weekly'

    // Set higher priority for home and team pages
    if (path === '/') { // home page
      priority = 1.0 // Highest priority for the homepage
      changefreq = 'monthly'
    } else if (path === '/blogs') {
      priority = 0.9 // Higher priority for the index blogs page
      changefreq = 'daily'
    } else if (path.includes('/blogs/')) {
      priority = 0.6 // Higher priority for the slug blogs page
			changefreq = 'daily'
		}

    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: changefreq,
      priority: priority, // Dynamic priority based on the page
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
	}
}