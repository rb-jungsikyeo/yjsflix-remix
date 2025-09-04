import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');
  const width = url.searchParams.get('width') || '500';
  
  if (!imageUrl) {
    return new Response('Image URL is required', { status: 400 });
  }
  
  try {
    // TMDb 이미지 URL 생성
    const tmdbUrl = `https://image.tmdb.org/t/p/w${width}${imageUrl}`;
    
    // 이미지 페치
    const imageResponse = await fetch(tmdbUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    // 이미지 데이터와 컨텐츠 타입 가져오기
    const imageData = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // 캐싱 헤더와 함께 이미지 반환
    return new Response(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1년 캐싱
        'CDN-Cache-Control': 'max-age=31536000',
        'Vercel-CDN-Cache-Control': 'max-age=31536000',
      }
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    return new Response('Failed to process image', { status: 500 });
  }
}