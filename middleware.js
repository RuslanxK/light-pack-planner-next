export { default } from 'next-auth/middleware'


export const config = {
  
    matcher: ['/', '/trips/:path*', '/bag/:path*', "/settings", "/api/trips/new", "/bags/new", "/bags/duplicate", "/categories/new", "/items/new", "/articles", "/article/:path*", "/settings", "/billing"]
  };

  
  