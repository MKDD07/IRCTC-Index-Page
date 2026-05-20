const PEXELS_KEY = typeof ENV !== 'undefined' ? ENV.PEXELS_API_KEY : '';

const destinations = [
  { name: 'Goa', query: 'Goa India beach' },
  { name: 'Manali', query: 'Manali Himachal Pradesh mountains' },
  { name: 'Kerala', query: 'Kerala backwaters India' },
  { name: 'Rajasthan', query: 'Jaipur Rajasthan palace' },
  { name: 'Andaman', query: 'Andaman islands beach tropical' },
  { name: 'Leh Ladakh', query: 'Leh Ladakh mountain landscape' },
  { name: 'Munnar', query: 'Munnar tea plantations Kerala' },
  { name: 'Varanasi', query: 'Varanasi Ganga Ghat India' },
  { name: 'Hampi', query: 'Hampi ruins Karnataka heritage' },
  { name: 'Agra', query: 'Agra Taj Mahal sunrise' },
];

const packages = [
  { name: 'Goa Beach Escape', duration: '4N/5D', price: '₹24,999', rating: '4.7', reviews: '2.3k', inclusions: 'Flight + Hotel + Breakfast', query: 'Goa beach resort', badge: 'Popular', badgeColor: 'bg-red-100 text-red-700' },
  { name: 'Kerala Backwaters', duration: '5N/6D', price: '₹32,499', rating: '4.8', reviews: '1.8k', inclusions: 'Hotel + Houseboat + Meals', query: 'Kerala houseboat backwaters', badge: 'Best Seller', badgeColor: 'bg-green-100 text-green-700' },
  { name: 'Manali Adventure', duration: '6N/7D', price: '₹28,999', rating: '4.6', reviews: '3.1k', inclusions: 'Hotel + Transfers + Activities', query: 'Manali snow mountain winter', badge: 'Adventure', badgeColor: 'bg-blue-100 text-blue-700' },
  { name: 'Rajasthan Heritage', duration: '7N/8D', price: '₹35,999', rating: '4.9', reviews: '4.2k', inclusions: 'Hotel + Guide + Entry Tickets', query: 'Rajasthan fort palace heritage', badge: 'Cultural', badgeColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Bali Honeymoon', duration: '5N/6D', price: '₹62,999', rating: '4.8', reviews: '2.7k', inclusions: 'Flights + Villa + Couples Spa', query: 'Bali honeymoon villa pool', badge: 'Honeymoon', badgeColor: 'bg-pink-100 text-pink-700' },
  { name: 'Singapore Explorer', duration: '4N/5D', price: '₹54,999', rating: '4.7', reviews: '1.5k', inclusions: 'Flights + Hotel + City Tour', query: 'Singapore Gardens by Bay', badge: 'International', badgeColor: 'bg-purple-100 text-purple-700' },
];

const HotelSearch = {
  API_KEY: typeof ENV !== 'undefined' ? ENV.SERP_API_KEY : '',
};

// ─── SerpApi Data Fetching ─────────────────────────────────────────────────────

async function fetchHotels(location = 'Mumbai', checkIn = '2026-06-20', checkOut = '2026-06-25') {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    q: location,
    check_in_date: checkIn,
    check_out_date: checkOut,
    api_key: HotelSearch.API_KEY,
    num: 20
  });

  try {
    const targetUrl = `https://serpapi.com/search.json?${params.toString()}`;
    const response = await fetch(`${HotelSearch.PROXY}${targetUrl}`);
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

async function fetchPackages(query = 'Holiday Packages Goa') {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    q: query,
    check_in_date: '2026-06-15',
    check_out_date: '2026-06-20',
    api_key: HotelSearch.API_KEY,
    num: 6
  });

  try {
    const targetUrl = `https://serpapi.com/search.json?${params.toString()}`;
    const response = await fetch(`${HotelSearch.PROXY}${targetUrl}`);
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

async function fetchFlightDeals(from = 'DEL', to = 'BOM') {
  const params = new URLSearchParams({
    engine: 'google_flights',
    departure_id: from,
    arrival_id: to,
    outbound_date: '2026-06-20',
    type: '2',
    currency: 'INR',
    api_key: HotelSearch.API_KEY
  });

  try {
    const url = `https://serpapi.com/search.json?${params.toString()}`;
    const response = await fetch(`${HotelSearch.PROXY}${url}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpApi Flight Error (${response.status}):`, errorText);
      return null;
    }
    const data = await response.json();
    return {
      route: `${from} → ${to}`,
      data: data.best_flights?.[0] || data.other_flights?.[0]
    };
  } catch (error) {
    console.error(`Fetch error for flights ${from}-${to}:`, error);
    return null;
  }
}

// ─── REST OF FILE UNCHANGED ──────────────────────────────────────────────────

const exploreItems = [
  { title: 'Guide: Best Time to Visit Goa', tag: 'Travel Guide', query: 'Goa beach sunset travel' },
  { title: 'Top 10 Hill Stations Near Delhi', tag: 'Listicle', query: 'hill station mountains fog India' },
  { title: 'Budget Trips Under ₹10K in India', tag: 'Budget Travel', query: 'backpacking India mountains budget' },
  { title: 'Monsoon Destinations You Must See', tag: 'Seasonal', query: 'monsoon India waterfall nature green' },
];

const irctcCategories = [
  { name: 'Rail Tour Packages', desc: 'Explore India via standard rail circuits', query: 'Indian Railways train scenic India' },
  { name: 'Bharat Gaurav Trains', desc: 'Theme-based luxury circuit trains', query: 'luxury train interior India palace on wheels' },
  { name: 'Pilgrimage Specials', desc: 'Divine journeys to major holy sites', query: 'Varanasi temple Aarti prayer' },
  { name: 'Air Tour Packages', desc: 'Domestic & International air travel', query: 'airplane flying sky clouds sunset' },
  { name: 'International Tours', desc: 'Global destinations at great prices', query: 'Dubai city skyline Burj Khalifa' },
  { name: 'Cruise Packages', desc: 'Short duration ocean & river cruises', query: 'luxury cruise ship ocean deck' },
  { name: 'Wellness & Spa', desc: 'Yoga & Ayurvedic retreats in nature', query: 'Yoga meditation Kerala nature' },
  { name: 'Hill Station Tours', desc: 'Escape to the pristine Himalayas', query: 'Himalayas mountains snow green' },
];

async function fetchPexels(query, size = 'medium', perPage = 1) {
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const d = await r.json();
  if (d.photos && d.photos.length) {
    return d.photos[0].src[size] || d.photos[0].src.medium;
  }
  return 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1600';
}

async function loadTrending() {
  const grid = document.getElementById('trending-grid');
  if (!grid) return;

  for (const dest of destinations) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide flex flex-col items-center group cursor-pointer';
    slide.innerHTML = `
      <div class="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-[#2d2383] transition-all duration-300">
        <div class="w-full h-full bg-gray-200 animate-pulse"></div>
      </div>
      <div class="mt-4 text-center">
        <div class="text-gray-900 font-bold text-sm md:text-base group-hover:text-[#2d2383] transition-colors">${dest.name}</div>
        <div class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Explore</div>
      </div>`;
    grid.appendChild(slide);

    fetchPexels(dest.query).then(url => {
      const container = slide.querySelector('.rounded-full');
      container.innerHTML = `<img src="${url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${dest.name}"/>`;
    });
  }

  new Swiper('.trending-swiper', {
    slidesPerView: 3,
    spaceBetween: 12,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
      1200: { slidesPerView: 7 },
    }
  });
}

async function loadPackages(query = 'Holiday Packages') {
  const grid = document.getElementById('packages-grid');
  if (!grid) return;

  grid.innerHTML = Array(3).fill(0).map(() => `
    <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div class="w-full h-52 bg-gray-200"></div>
      <div class="p-5 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  `).join('');

  const data = await fetchPackages(query);
  grid.innerHTML = '';

  if (!data || data.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-gray-500 font-medium">No packages found for this category.</div>`;
    return;
  }

  data.slice(0, 6).forEach((pkg, index) => {
    const card = document.createElement('div');
    card.className = 'swiper-slide h-auto md:!w-auto md:!mr-0 bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group';

    let rawPrice = pkg.rate_per_night?.lowest || '24,999';
    let numericPrice = 24999;
    if (typeof rawPrice === 'string') {
      numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 24999;
      if (rawPrice.includes('$')) numericPrice *= 83;
    }

    const totalPackagePrice = Math.round((numericPrice * 4) + 12000);
    const formattedPrice = `₹${totalPackagePrice.toLocaleString('en-IN')}`;

    const thumbnail = pkg.images?.[0]?.thumbnail || 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600';
    const badges = ['Best Seller', 'Recommended', 'Limited Offer', 'New', 'Trending', 'Popular'];
    const badgeColors = ['bg-red-100 text-red-700', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];

    card.innerHTML = `
      <div class="relative h-52 overflow-hidden">
        <img src="${thumbnail}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${pkg.name}"/>
        <div class="absolute top-4 left-4 ${badgeColors[index % 6]} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">${badges[index % 6]}</div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1 text-yellow-400">
            <i class="fa-solid fa-star text-xs"></i>
            <span class="text-xs font-bold text-gray-900">${pkg.overall_rating ? Number(pkg.overall_rating).toFixed(1) : '4.8'}</span>
          </div>
          <span class="text-[10px] text-gray-400 font-medium">${pkg.reviews || '1.2k'} reviews</span>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-1 truncate">${pkg.name.replace('Hotel', 'Package')}</h3>
        <p class="text-xs text-gray-500 mb-4"><i class="fa-solid fa-calendar-days text-[#2d2383] mr-1"></i> 5N/6D · Flight + Hotel + Meals Included</p>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span class="text-[10px] text-gray-400 block">Starts from</span>
            <span class="text-xl font-800 text-gray-900">${formattedPrice}</span>
          </div>
          <a href="${pkg.link || 'https://www.google.com/travel/hotels'}" target="_blank" class="primary-color text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-[#1e175a] transition-all text-center">
            Book Now
          </a>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  if (window.packagesSwiper) { window.packagesSwiper.destroy(true, true); }
  window.packagesSwiper = new Swiper('.packages-mobile-swiper', {
    slidesPerView: 1.2,
    spaceBetween: 16,
    scrollbar: { el: '.packages-mobile-swiper .swiper-scrollbar', draggable: true },
    breakpoints: { 768: { enabled: false } }
  });
}

function setActiveFilter(btn) {
  document.querySelectorAll('.package-filter').forEach(b => {
    b.classList.remove('primary-color', 'text-white');
    b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
  });
  btn.classList.add('primary-color', 'text-white');
  btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
}

async function loadFlights() {
  const grid = document.getElementById('flight-deals-grid');
  if (!grid) return;

const routes = [
  { from: 'DEL', to: 'BOM', name: 'Delhi → Mumbai' },
  { from: 'DEL', to: 'BLR', name: 'Delhi → Bengaluru' },
  { from: 'DEL', to: 'GOI', name: 'Delhi → Goa' },
  { from: 'DEL', to: 'CCU', name: 'Delhi → Kolkata' },

  // Added Major India Routes
  { from: 'DEL', to: 'MAA', name: 'Delhi → Chennai' },
  { from: 'DEL', to: 'HYD', name: 'Delhi → Hyderabad' },
  { from: 'DEL', to: 'AMD', name: 'Delhi → Ahmedabad' },
  { from: 'DEL', to: 'COK', name: 'Delhi → Kochi' },
  { from: 'DEL', to: 'JAI', name: 'Delhi → Jaipur' },
  { from: 'DEL', to: 'IXC', name: 'Delhi → Chandigarh' },
  { from: 'DEL', to: 'SXR', name: 'Delhi → Srinagar' },
  { from: 'DEL', to: 'IXB', name: 'Delhi → Bagdogra' }, // Darjeeling/Sikkim
  { from: 'DEL', to: 'VNS', name: 'Delhi → Varanasi' },
  { from: 'DEL', to: 'TRV', name: 'Delhi → Thiruvananthapuram' }
];

  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="swiper-slide bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  `).join('');

  const flightPromises = routes.map(r => fetchFlightDeals(r.from, r.to));
  const results = await Promise.all(flightPromises);

  grid.innerHTML = '';

  results.forEach((res, index) => {
    if (!res || !res.data) return;

    const flight = res.data;
    const leg = flight.flights[0];
    const price = flight.price ? `₹${flight.price.toLocaleString('en-IN')}` : '₹4,299';
    const originalPrice = Math.round(flight.price * 1.35);
    const discount = Math.round(((originalPrice - flight.price) / originalPrice) * 100);

    const airlineCode = leg.airline_code || (leg.airline === 'IndiGo' ? '6E' : leg.airline?.substring(0, 2).toUpperCase() || 'AI');
    const flightNumber = leg.flight_number || (100 + index * 12);
    const flightNo = `${airlineCode} ${flightNumber}`;
    const dateStr = '20 Jun \'26';
    const dateQuery = '2026-06-20';

    let bookingUrl = flight.link || `https://www.google.com/travel/flights?q=flights+from+${routes[index].from}+to+${routes[index].to}`;
    if (leg.airline === 'IndiGo' || leg.airline_code === '6E') {
      bookingUrl = `https://www.goindigo.in/book/flight-select.html?fromIata=${routes[index].from}&toIata=${routes[index].to}&departureDate=${dateQuery}&adultCount=1&tripType=OW`;
    }

    const card = document.createElement('div');
    card.className = 'swiper-slide bg-white border border-gray-100 rounded-2xl p-5 card-hover flex flex-col justify-between';
    card.style.height = 'auto';
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${res.route} · ${dateStr}</div>
            <div class="font-bold text-gray-900 text-lg">${routes[index].name}</div>
            <div class="text-[10px] text-gray-400 font-bold mt-0.5">${flightNo}</div>
          </div>
          <span class="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full font-bold border border-green-100">${discount}% OFF</span>
        </div>
        <div class="flex items-center gap-3 mb-6">
          <img src="${leg.airline_logo}" class="w-6 h-6 object-contain" alt="${leg.airline}">
          <div class="text-xs text-gray-500 font-medium">
            <span class="text-gray-900 font-bold">${leg.airline}</span> · ${Math.floor(leg.duration / 60)}h ${leg.duration % 60}m · Non-stop
          </div>
        </div>
      </div>
      <div class="flex items-end justify-between pt-4 border-t border-gray-50">
        <div>
          <div class="text-[10px] text-gray-400 line-through">₹${originalPrice.toLocaleString('en-IN')}</div>
          <div class="text-xl font-800 text-red-500">${price}</div>
          <div class="text-[10px] text-gray-400">per person</div>
        </div>
        <a href="${bookingUrl}" target="_blank" class="primary-color text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-[#1e175a] transition-all text-center">
          Book Now
        </a>
      </div>`;
    grid.appendChild(card);
  });

  const flightSection = document.querySelector('.flight-deals-swiper').closest('section');
  const flightNavBtns = flightSection.querySelectorAll('.flex.gap-2 button');

  new Swiper('.flight-deals-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    scrollbar: {
      el: '.flight-deals-swiper .swiper-scrollbar',
      draggable: true,
    },
    navigation: {
      prevEl: flightNavBtns[0],
      nextEl: flightNavBtns[1],
    },
    breakpoints: {
      576: { slidesPerView: 1, spaceBetween: 16 },
      768: { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 16 }
    }
  });
}

async function loadHotels(location = 'India') {
  const grid = document.getElementById('hotels-grid');
  if (!grid) return;

  const title = grid.closest('section').querySelector('h2');
  if (title) title.textContent = `Top Hotels in ${location}`;

  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div class="w-full h-52 bg-gray-200"></div>
      <div class="p-5 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="pt-3 border-t border-gray-100 flex justify-between">
          <div class="h-8 bg-gray-200 rounded w-1/3"></div>
          <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  `).join('');

  const hotelData = await fetchHotels(location);
  grid.innerHTML = '';

  if (!hotelData || hotelData.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-gray-500 font-medium">No hotels found for "${location}". Please try another city.</div>`;
    return;
  }

  hotelData.slice(0, 20).forEach(hotel => {
    const card = document.createElement('div');
    card.className = 'swiper-slide h-auto md:!w-auto md:!mr-0 bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group';

    let rawPrice = hotel.rate_per_night?.lowest || hotel.total_rate?.lowest || 'Contact for price';
    let formattedPrice = rawPrice;

    if (typeof rawPrice === 'string' && rawPrice.includes('$')) {
      const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericPrice)) {
        formattedPrice = `₹${Math.round(numericPrice * 83).toLocaleString('en-IN')}`;
      }
    } else if (typeof rawPrice === 'string' && !rawPrice.includes('₹') && !isNaN(parseFloat(rawPrice.replace(/[^0-9.]/g, '')))) {
      const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
      formattedPrice = `₹${Math.round(numericPrice * 83).toLocaleString('en-IN')}`;
    }

    let thumbnail = hotel.images?.[0]?.thumbnail || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600';
    if (thumbnail.includes('googleusercontent.com')) {
      thumbnail = thumbnail.replace(/s\d+-w\d+-h\d+/g, 's1024-w1024-h768');
    }

    const amenities = (hotel.amenities || []).slice(0, 3).map(a => `
      <span class="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">${a}</span>
    `).join('');

    card.innerHTML = `
      <div class="relative h-56 overflow-hidden">
        <img src="${thumbnail}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${hotel.name}"/>
        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
          <i class="fa-solid fa-star text-yellow-400"></i> ${hotel.overall_rating ? Number(hotel.overall_rating).toFixed(1) : '4.5'}
        </div>
        ${hotel.deal ? `<div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">${hotel.deal_type || 'Deal'}</div>` : ''}
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] text-[#2d2383] font-bold uppercase tracking-widest">${hotel.type || 'Hotel'}</span>
          <span class="text-[10px] text-gray-400 font-medium">${hotel.reviews || 0} reviews</span>
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-1 truncate">${hotel.name}</h3>
        <p class="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <i class="fa-solid fa-location-dot text-[#2d2383]"></i>
          <span class="truncate">${hotel.description?.substring(0, 40) || 'Prime location with modern amenities'}...</span>
        </p>
        <div class="flex flex-wrap gap-1.5 mb-4 h-5 overflow-hidden">${amenities}</div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span class="text-[10px] text-gray-400 block mb-0.5">Starts from</span>
            <span class="text-xl font-800 text-gray-900">${formattedPrice}</span>
            <span class="text-[10px] text-gray-400">/night</span>
          </div>
          <a href="${hotel.link || 'https://www.google.com/travel/hotels'}" target="_blank" class="bg-[#2d2383] text-white text-xs px-5 py-2.5 rounded-xl hover:bg-[#1e175a] transition-all font-bold shadow-sm hover:shadow-md flex items-center gap-2 justify-center">
            Book Room <i class="fa-solid fa-arrow-right-long"></i>
          </a>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  if (window.hotelsSwiper) { window.hotelsSwiper.destroy(true, true); }
  window.hotelsSwiper = new Swiper('.hotels-mobile-swiper', {
    slidesPerView: 1.2,
    spaceBetween: 16,
    scrollbar: { el: '.hotels-mobile-swiper .swiper-scrollbar', draggable: true },
    breakpoints: { 768: { enabled: false } }
  });
}

async function loadIRCTC() {
  const grid = document.getElementById('irctc-grid');
  if (!grid) return;

  const tourImages = ['assets/img/tours-001.png', 'assets/img/tours-002.png', 'assets/img/tours-003.png'];
  
  tourImages.forEach((url, i) => {
    const card = document.createElement('div');
    card.className = 'swiper-slide group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 max-[576px]:!w-full md:!w-auto';
    card.innerHTML = `<img src="${url}" alt="Tour ${i+1}" class="w-full h-auto md:h-[350px] md:w-auto object-contain group-hover:scale-[1.02] transition-transform duration-700 block">`;
    grid.appendChild(card);
  });

  new Swiper('.irctc-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    scrollbar: {
      el: '.irctc-swiper .swiper-scrollbar',
      draggable: true,
    },
    breakpoints: {
      576: { spaceBetween: 0 },
      768: { spaceBetween: 24 }
    }
  });
}

async function loadExplore() {
  const grid = document.getElementById('explore-grid');
  if (!grid) return;

  for (const item of exploreItems) {
    const card = document.createElement('div');
    card.className = 'rounded-2xl overflow-hidden cursor-pointer card-hover relative group';
    card.style.height = '220px';
    card.innerHTML = `<div class="w-full h-full bg-gray-200 animate-pulse"></div>`;
    grid.appendChild(card);

    fetchPexels(item.query).then(url => {
      card.innerHTML = `
        <img src="${url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="${item.title}"/>
        <div class="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
        <div class="absolute inset-0 flex flex-col justify-end p-4">
          <span class="text-xs bg-[#2d2383] text-white px-2 py-0.5 rounded-full w-fit mb-2">${item.tag}</span>
          <div class="text-white font-semibold text-sm leading-tight">${item.title}</div>
          <div class="text-gray-300 text-xs mt-1 group-hover:text-white transition-colors flex items-center gap-1">
            Read more <i class="fa-solid fa-angle-right text-[10px]"></i>
          </div>
        </div>`;
    });
  }
}

function setCategory(cat, btn) {
  document.querySelectorAll('.category-tab').forEach(t => {
    t.classList.remove('active');
  });
  btn.classList.add('active');

  document.querySelectorAll('[id^="form-"]').forEach(f => {
    f.classList.add('hidden');
    f.classList.remove('fade-in');
  });
  const form = document.getElementById('form-' + cat);
  if (form) {
    form.classList.remove('hidden');
    setTimeout(() => form.classList.add('fade-in'), 10);
  }

  const img = document.getElementById('hero-img');
  img.style.opacity = '0';

  const queries = {
    flights: 'airplane wing clouds sunset',
    hotels: 'luxury hotel resort pool lobby',
    homestays: 'bali villa tropical pool garden',
    holidays: 'maldives beach paradise tropical',
    trains: 'luxury train interior dining car',
    buses: 'modern coach bus highway sunset',
    cabs: 'luxury car city street night',
    tours: 'taj mahal agra india sunrise',
    cruise: 'luxury cruise ship ocean sunset',
    forex: 'money cash currency exchange',
    insurance: 'family travel insurance safety',
    visa: 'passport visa stamp travel document'
  };

  fetchPexels(queries[cat] || cat, 'large2x').then(url => {
    const tempImg = new Image();
    tempImg.src = url;
    tempImg.onload = () => {
      img.src = url;
      img.style.opacity = '1';
    };
  });
}

function setSpecialFare(element) {
  document.querySelectorAll('.special-fare-tag').forEach(tag => tag.classList.remove('active'));
  element.classList.add('active');
}

function toggleTripType(type) {
  const returnField = document.getElementById('return-date-field');
  const returnText = returnField.querySelector('.font-bold');

  if (type === 'one-way') {
    returnField.classList.add('opacity-40', 'pointer-events-none');
    returnText.classList.replace('text-[#2d2383]', 'text-gray-400');
    returnText.textContent = 'Select Date';
  } else {
    returnField.classList.remove('opacity-40', 'pointer-events-none');
    returnText.classList.replace('text-gray-400', 'text-[#2d2383]');
    returnText.textContent = '18 May \'26';
  }
}

function swapCities() {
  const fromEl = document.querySelector('#form-flights .grid .border:nth-child(1) .font-bold');
  const toEl = document.querySelector('#form-flights .grid .border:nth-child(3) .font-bold');
  if (fromEl && toEl) {
    const tmp = fromEl.textContent;
    fromEl.textContent = toEl.textContent;
    toEl.textContent = tmp;
  }
}

function loadBannerSwiper() {
  new Swiper('.banner-swiper', {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 20,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.banner-swiper .swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.banner-swiper .swiper-button-next',
      prevEl: '.banner-swiper .swiper-button-prev',
    },
    breakpoints: {
      1200: { slidesPerView: 2, spaceBetween: 24 },
      0: { slidesPerView: 1, spaceBetween: 0 }
    }
  });
}

function toggleFAQ(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('i');
  if (!content || !icon) return;
  document.querySelectorAll('#faq-accordion > div > div:last-child').forEach(div => {
    if (div !== content && !div.classList.contains('hidden')) {
      div.classList.add('hidden');
      div.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
    }
  });
  const isHidden = content.classList.contains('hidden');
  content.classList.toggle('hidden');
  icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

// ─── INIT ────────────────────────────────────────────────────────────────────
loadTrending();
loadPackages('India Holiday Packages');
loadFlights();
loadHotels();
loadIRCTC();
loadExplore();
loadBannerSwiper();
