/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'fxleyozwnwxfzpvvjwwn.storage.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'logos-api.apistemic.com',
      },
            {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
                  {
        protocol: 'https',
        hostname: 'img.cofynd.com',
      },
     ],
  },
};

export default nextConfig;
