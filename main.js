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
  PROXY: 'https://api.allorigins.win/raw?url=',
};


// ─── SerpApi Data Fetching ────────────────────────────────────────────────────

function getOffsetDateString(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getFormattedDateString(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const yearShort = String(date.getFullYear()).slice(-2);
  return `${day} ${month} '${yearShort}`;
}

async function fetchHotels(location = 'Mumbai', checkIn = getOffsetDateString(3), checkOut = getOffsetDateString(8)) {
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
    check_in_date: getOffsetDateString(3),
    check_out_date: getOffsetDateString(8),
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
    outbound_date: getOffsetDateString(7),
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

// ─── Static Data ──────────────────────────────────────────────────────────────

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

// ─── Pexels ───────────────────────────────────────────────────────────────────

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

// ─── Section Loaders ──────────────────────────────────────────────────────────

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
    autoplay: { delay: 2500, disableOnInteraction: false },
    breakpoints: {
      640:  { slidesPerView: 3 },
      768:  { slidesPerView: 4 },
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
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group- transition-opacity duration-300"></div>
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
    { from: 'DEL', to: 'MAA', name: 'Delhi → Chennai' },
    { from: 'DEL', to: 'HYD', name: 'Delhi → Hyderabad' },
    { from: 'DEL', to: 'AMD', name: 'Delhi → Ahmedabad' },
    { from: 'DEL', to: 'COK', name: 'Delhi → Kochi' },
    { from: 'DEL', to: 'JAI', name: 'Delhi → Jaipur' },
    { from: 'DEL', to: 'IXC', name: 'Delhi → Chandigarh' },
    { from: 'DEL', to: 'SXR', name: 'Delhi → Srinagar' },
    { from: 'DEL', to: 'IXB', name: 'Delhi → Bagdogra' },
    { from: 'DEL', to: 'VNS', name: 'Delhi → Varanasi' },
    { from: 'DEL', to: 'TRV', name: 'Delhi → Thiruvananthapuram' },
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
    const dateStr = getFormattedDateString(7);
    const dateQuery = getOffsetDateString(7);

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
    scrollbar: { el: '.flight-deals-swiper .swiper-scrollbar', draggable: true },
    navigation: { prevEl: flightNavBtns[0], nextEl: flightNavBtns[1] },
    breakpoints: {
      576:  { slidesPerView: 1, spaceBetween: 16 },
      768:  { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 16 },
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
      if (!isNaN(numericPrice)) formattedPrice = `₹${Math.round(numericPrice * 83).toLocaleString('en-IN')}`;
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
    card.innerHTML = `<img src="${url}" alt="Tour ${i + 1}" class="w-full h-auto md:h-[350px] md:w-auto object-contain group-hover:scale-[1.02] transition-transform duration-700 block">`;
    grid.appendChild(card);
  });

  new Swiper('.irctc-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    scrollbar: { el: '.irctc-swiper .swiper-scrollbar', draggable: true },
    breakpoints: {
      576: { spaceBetween: 0 },
      768: { spaceBetween: 24 },
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

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function setCategory(cat, btn) {
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
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
    visa: 'passport visa stamp travel document',
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
  const toEl   = document.querySelector('#form-flights .grid .border:nth-child(3) .font-bold');
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
    autoplay: { delay: 3500, disableOnInteraction: false },
    pagination: { el: '.banner-swiper .swiper-pagination', type: 'progressbar' },
    navigation: {
      nextEl: '.banner-swiper .swiper-button-next',
      prevEl: '.banner-swiper .swiper-button-prev',
    },
    breakpoints: {
      1200: { slidesPerView: 2, spaceBetween: 24 },
      0:    { slidesPerView: 1, spaceBetween: 0 },
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

// ─── ANIMATION SYSTEM ─────────────────────────────────────────────────────────

/**
 * Collects all animatable elements within a section.
 */
function getAnimatableElements(section, excludeCards = false) {
  if (section.id === 'flights-section') {
    const wrapper = document.getElementById('flights-content-wrapper');
    return wrapper ? [wrapper] : [section];
  }

  if (section.id === 'query-section') {
    const elements = [];
    const img = section.querySelector('img[alt="TripEase App"]');
    if (img) elements.push(img);
    
    const formSide = section.querySelector('.rounded-2xl.p-5');
    if (formSide) {
      formSide.querySelectorAll('h3, p, .grid > div, form > .space-y-2, button[type="submit"]').forEach(el => {
        elements.push(el);
      });
    }
    return elements.filter(el =>
      !el.classList.contains('section-animate-btn') && !el.closest?.('.section-animate-btn')
    );
  }

  if (section.id === 'vande-bharat-section') {
    const elements = [];
    const logo = section.querySelector('img');
    const badge = section.querySelector('span');
    const h3 = section.querySelector('h3');
    const p = section.querySelector('p');
    if (logo) elements.push(logo);
    if (badge) elements.push(badge);
    if (h3) elements.push(h3);
    if (p) elements.push(p);
    return elements.filter(el =>
      !el.classList.contains('section-animate-btn') && !el.closest?.('.section-animate-btn')
    );
  }

  const elements = [];

  // Headings / paragraphs not inside dynamic card zones
  section.querySelectorAll('h2, h3, p').forEach(el => {
    if (
      !el.closest('.swiper-slide') &&
      !el.closest('#packages-grid') &&
      !el.closest('#hotels-grid') &&
      !el.closest('#explore-grid') &&
      !el.closest('#offers-scroll') &&
      !el.closest('.footer') &&
      !el.closest('footer')
    ) {
      elements.push(el);
    }
  });

  // Hero form tabs and fields
  const heroForm = section.querySelector('.bg-white\\/95, form, .grid-cols-12');
  if (heroForm) {
    const tabs = section.querySelector('.flex.flex-wrap.gap-2, .border-b');
    if (tabs) elements.push(tabs);
    heroForm.querySelectorAll('.grid > div, .flex > div').forEach(f => elements.push(f));
  }

  // Cards and their inner pieces (for stagger depth)
  if (!excludeCards) {
    section
      .querySelectorAll('.swiper-slide, #packages-grid > div, #hotels-grid > div, #explore-grid > div, #offers-scroll > div')
      .forEach(card => {
        elements.push(card);
        const innerImg    = card.querySelector('.relative.h-52, .relative.h-56, .relative');
        const innerRating = card.querySelector('.p-5 > div.flex, .p-5 > div:first-child');
        const innerTitle  = card.querySelector('.p-5 > h3, h3');
        const innerDesc   = card.querySelector('.p-5 > p, p');
        const innerFooter = card.querySelector('.p-5 > div.pt-4, .p5 > div:last-child');
        if (innerImg)    elements.push(innerImg);
        if (innerRating) elements.push(innerRating);
        if (innerTitle)  elements.push(innerTitle);
        if (innerDesc)   elements.push(innerDesc);
        if (innerFooter) elements.push(innerFooter);
      });
  }

  // Fallback: direct children
  if (elements.length === 0) {
    Array.from(section.children).forEach(el => {
      if (!el.classList.contains('section-animate-btn') && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
        elements.push(el);
      }
    });
  }

  return elements.filter(el =>
    !el.classList.contains('section-animate-btn') && !el.closest?.('.section-animate-btn')
  );
}

// ── Animation-type rotation ───────────────────────────────────────────────────
// Sections are assigned one of 4 types in round-robin order so each type
// appears across the page. The assignment is stored on the element and reused.

const ANIM_TYPES = ['popup', 'fade', 'clip-bottom', 'clip-left-to-right'];
let _animTypeCounter = 0;

function getOrAssignSectionAnimType(section) {
  if (!section.dataset.animType) {
    section.dataset.animType = ANIM_TYPES[_animTypeCounter % ANIM_TYPES.length];
    _animTypeCounter++;
  }
  return section.dataset.animType;
}

// "From" and "To" vars for each animation type
const ANIM_FROM = {
  'popup':              { opacity: 0, scale: 0.75, y: 45,  x: 0,   clipPath: 'none' },
  'fade':               { opacity: 0, scale: 1,    y: 22,  x: 0,   clipPath: 'none' },
  'clip-bottom':        { opacity: 0, scale: 1,    y: 20,  x: 0,   clipPath: 'inset(100% 0% 0% 0%)' },
  'clip-left-to-right': { opacity: 0, scale: 1,    y: 0,   x: -18, clipPath: 'inset(0% 100% 0% 0%)' },
};

const ANIM_TO = {
  'popup':              { opacity: 1, scale: 1, y: 0, x: 0, clipPath: 'none',                duration: 1.00, ease: 'back.out(1.4)', stagger: 0.055 },
  'fade':               { opacity: 1, scale: 1, y: 0, x: 0, clipPath: 'none',                duration: 0.80, ease: 'power2.out',    stagger: 0.045 },
  'clip-bottom':        { opacity: 1, scale: 1, y: 0, x: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power2.out',    stagger: 0.060 },
  'clip-left-to-right': { opacity: 1, scale: 1, y: 0, x: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power2.out',    stagger: 0.060 },
};

// ── Core animate function (single definition) ─────────────────────────────────

/**
 * @param {Element} section
 * @param {boolean} isUserTriggered
 *   true  → use the section's assigned animation type (button press)
 *   false → universal scroll-down fade-in
 */
function animateSection(section, isUserTriggered = false) {
  if (!section) return;

  // Flights section: special horizontal clip reveal on its wrapper
  if (section.id === 'flights-section') {
    const wrapper = document.getElementById('flights-content-wrapper');
    if (wrapper) {
      gsap.killTweensOf(wrapper);
      if (isUserTriggered) {
        gsap.fromTo(wrapper,
          { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1, y: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, duration: 3.0, ease: 'power2.out', overwrite: 'auto' }
        );
      } else {
        gsap.fromTo(wrapper,
          { opacity: 0, y: 18, clipPath: 'none' },
          { opacity: 1, y: 0, clipPath: 'none', duration: 0.65, ease: 'power1.out', overwrite: 'auto' }
        );
      }
    }
    return;
  }

  // Custom Query section: special image popin from left with clip path
  if (section.id === 'query-section') {
    const img = section.querySelector('img[alt="TripEase App"]');
    const formSide = section.querySelector('.rounded-2xl.p-5');
    const formElements = formSide ? Array.from(formSide.querySelectorAll('h3, p, .grid > div, form > .space-y-2, button[type="submit"]')) : [];

    if (isUserTriggered) {
      if (img) {
        gsap.killTweensOf(img);
        gsap.fromTo(img,
          { clipPath: 'inset(0% 100% 0% 0%)', x: -80, opacity: 0, scale: 0.9 },
          { clipPath: 'inset(0% 0% 0% 0%)', x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
        );
      }
      if (formElements.length) {
        gsap.killTweensOf(formElements);
        gsap.fromTo(formElements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.06, delay: 0.2 }
        );
      }
    } else {
      const allEls = [];
      if (img) allEls.push(img);
      if (formElements.length) allEls.push(...formElements);
      gsap.killTweensOf(allEls);
      gsap.fromTo(allEls,
        { opacity: 0, y: 18, scale: 1, clipPath: 'none', x: 0 },
        { opacity: 1, y: 0, scale: 1, clipPath: 'none', x: 0, duration: 0.65, ease: 'power1.out', stagger: 0.04 }
      );
    }
    return;
  }

  const elements = getAnimatableElements(section, false);
  if (!elements.length) return;
  gsap.killTweensOf(elements);

  if (isUserTriggered) {
    // ── Button press: play the section's assigned animation type ────────────
    const animType = getOrAssignSectionAnimType(section);
    gsap.fromTo(elements,
      { ...ANIM_FROM[animType] },
      { ...ANIM_TO[animType], overwrite: 'auto' }
    );
  } else {
    // ── Scroll-triggered: universal soft fade-up for all sections ───────────
    gsap.fromTo(elements,
      { opacity: 0, y: 18, scale: 1, clipPath: 'none' },
      { opacity: 1, y: 0,  scale: 1, clipPath: 'none', duration: 0.65, ease: 'power1.out', stagger: 0.04, overwrite: 'auto' }
    );
  }
}

// ── Viewport observer ─────────────────────────────────────────────────────────

let scrollObserver = null;

/**
 * Pre-hides all sections then observes them so each animates on first enter.
 * @param {boolean} isUserTriggered
 */
function setupViewportAnimations(isUserTriggered = false) {
  if (scrollObserver) scrollObserver.disconnect();

  const flightsSection = document.getElementById('flights-section');
  if (flightsSection) {
    // Keep outer container visible
    gsap.set(flightsSection, { opacity: 1, y: 0, scale: 1, clearProps: 'transform,opacity' });
    
    // Dynamic wrap if needed
    if (!document.getElementById('flights-content-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.id = 'flights-content-wrapper';
      wrapper.className = 'w-full h-full';
      
      const children = Array.from(flightsSection.childNodes);
      children.forEach(child => {
        if (child.nodeType === 1 && child.classList.contains('section-animate-btn')) {
          // skip
        } else {
          wrapper.appendChild(child);
        }
      });
      flightsSection.appendChild(wrapper);
    }
  }

  // Pre-hide every non-hero section
  document.querySelectorAll('section').forEach(section => {
    if (section.id === 'hero-section') return;

    if (section.id === 'flights-section') {
      const wrapper = document.getElementById('flights-content-wrapper');
      if (wrapper) {
        if (isUserTriggered) {
          gsap.set(wrapper, { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1, y: 0 });
        } else {
          gsap.set(wrapper, { opacity: 0, y: 18, clipPath: 'none' });
        }
      }
      return;
    }

    if (section.id === 'query-section') {
      const img = section.querySelector('img[alt="TripEase App"]');
      const formSide = section.querySelector('.rounded-2xl.p-5');
      const formElements = formSide ? Array.from(formSide.querySelectorAll('h3, p, .grid > div, form > .space-y-2, button[type="submit"]')) : [];

      if (isUserTriggered) {
        if (img) gsap.set(img, { clipPath: 'inset(0% 100% 0% 0%)', x: -80, opacity: 0, scale: 0.9 });
        gsap.set(formElements, { opacity: 0, y: 20 });
      } else {
        const allEls = [];
        if (img) allEls.push(img);
        if (formElements.length) allEls.push(...formElements);
        gsap.set(allEls, { opacity: 0, y: 18, scale: 1, clipPath: 'none', x: 0 });
      }
      return;
    }

    const elements = getAnimatableElements(section, false);
    if (!elements.length) return;

    if (isUserTriggered) {
      const animType = getOrAssignSectionAnimType(section);
      gsap.set(elements, { ...ANIM_FROM[animType] });
    } else {
      gsap.set(elements, { opacity: 0, y: 18, scale: 1, clipPath: 'none' });
    }
  });

  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSection(entry.target, isUserTriggered);
        scrollObserver.unobserve(entry.target); // fire once per section
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'hero-section') scrollObserver.observe(section);
  });
}

// ── Global "record" button (resets scroll + replays all with assigned types) ──

function animateAllSections() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => setupViewportAnimations(true), 500);
}

// ── Per-section animate buttons ───────────────────────────────────────────────

function addSectionButtons() {
  document.querySelectorAll('section').forEach(section => {
    if (section.offsetHeight < 100) return;
    if (section.id === 'hero-section') return;

    section.classList.add('relative');

    const btn = document.createElement('button');
    btn.className = [
      'section-animate-btn',
      'absolute top-3 right-3 z-30',
      'bg-white/60 hover:bg-white backdrop-blur-md',
      'opacity-[0.1] ',
      'text-gray-500 hover:text-gray-900',
      'px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide',
      'shadow-sm hover:shadow transition-all duration-300',
      'flex items-center gap-1',
    ].join(' ');
    btn.innerHTML = '<i class="fa-solid fa-sparkles text-amber-500"></i> Animate';
    btn.title = 'Animate Section';

    btn.addEventListener('click', e => {
      e.stopPropagation();
      
      if (section.id === 'flights-section') {
        const wrapper = document.getElementById('flights-content-wrapper');
        if (wrapper) {
          gsap.killTweensOf(wrapper);
          gsap.set(wrapper, { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1, y: 0 });
          requestAnimationFrame(() => animateSection(section, true));
        }
        return;
      }

      if (section.id === 'query-section') {
        const img = section.querySelector('img[alt="TripEase App"]');
        const formSide = section.querySelector('.rounded-2xl.p-5');
        const formElements = formSide ? Array.from(formSide.querySelectorAll('h3, p, .grid > div, form > .space-y-2, button[type="submit"]')) : [];

        if (img) {
          gsap.killTweensOf(img);
          gsap.set(img, { clipPath: 'inset(0% 100% 0% 0%)', x: -80, opacity: 0, scale: 0.9 });
        }
        gsap.killTweensOf(formElements);
        gsap.set(formElements, { opacity: 0, y: 20 });
        requestAnimationFrame(() => animateSection(section, true));
        return;
      }

      // Pre-set the "from" state then animate
      const elements = getAnimatableElements(section, false);
      const animType = getOrAssignSectionAnimType(section);
      gsap.killTweensOf(elements);
      gsap.set(elements, { ...ANIM_FROM[animType] });
      // One rAF so gsap.set() is flushed before the tween starts
      requestAnimationFrame(() => animateSection(section, true));
    });

    section.appendChild(btn);
  });
}

// ── Global navbar record button ───────────────────────────────────────────────

function createGlobalAnimateBtn() {
  const navbarRight = document.querySelector('nav .max-w-\\[1400px\\] > div:nth-child(2)');
  if (!navbarRight) return;

  const globalBtn = document.createElement('button');
  globalBtn.className = [
    'bg-red-50 hover:bg-red-100 text-red-600',
    'border border-red-100 px-3.5 py-2 rounded-lg text-xs font-bold',
    'transition-all opacity-[0.1] ',
    'flex items-center gap-1.5 mr-2 shadow-sm',
  ].join(' ');
  globalBtn.innerHTML = '<i class="fa-solid fa-circle text-[8px] animate-pulse"></i>';
  globalBtn.title = 'Animate All Sections (Record Mode)';
  globalBtn.addEventListener('click', animateAllSections);

  navbarRight.insertBefore(globalBtn, navbarRight.lastElementChild);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

loadTrending();
loadPackages('India Holiday Packages');
loadFlights();
loadHotels();
loadIRCTC();
loadExplore();
loadBannerSwiper();

setTimeout(() => {
  addSectionButtons();
  createGlobalAnimateBtn();
  setupViewportAnimations(); // universal scroll fade-in on normal load
}, 4000);

// Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ─── TRAINS DEMO AUTOFILL & SEARCH SYSTEM ────────────────────────────────────

const trainData = [
  { no: "12952", name: "Mumbai Central Tejas Rajdhani Express", type: "Fastest", timeFrom: "4:55 PM", timeTo: "7:38 AM", nextDay: "+1 day", duration: "14h 43m", changes: "0 changes", priceRange: "₹3,161 - ₹5,306", classes: "3A, 2A, 1A", status: "WL seats" },
  { no: "22222", name: "Mumbai CSMT Rajdhani Express", type: "Fast", timeFrom: "4:55 PM", timeTo: "11:15 AM", nextDay: "+1 day", duration: "18h 20m", changes: "0 changes", priceRange: "₹3,261 - ₹5,461", classes: "3A, 2A, 1A", status: "WL seats" },
  { no: "12954", name: "August Kranti Tejas Rajdhani Express", type: "", timeFrom: "5:15 PM", timeTo: "9:08 AM", nextDay: "+1 day", duration: "15h 53m", changes: "0 changes", priceRange: "₹3,136 - ₹5,246", classes: "3A, 2A, 1A", status: "WL seats" },
  { no: "12904", name: "Golden Temple Mail", type: "", timeFrom: "4:00 AM", timeTo: "10:43 PM", nextDay: "", duration: "18h 43m", changes: "0 changes", priceRange: "₹668 - ₹3,956", classes: "SL, 3A, 2A, 1A", status: "WL seats" },
  { no: "12138", name: "Punjab Mail", type: "", timeFrom: "5:10 AM", timeTo: "7:35 AM", nextDay: "+1 day", duration: "26h 25m", changes: "0 changes", priceRange: "₹728 - ₹4,331", classes: "SL, 3A, 2A, 1A", status: "WL seats" },
  { no: "12618", name: "Mangala Lakshadweep Express", type: "", timeFrom: "5:35 AM", timeTo: "5:17 AM", nextDay: "+1 day", duration: "23h 42m", changes: "0 changes", priceRange: "₹713 - ₹2,536", classes: "SL, 3A, 2A", status: "WL seats" },
  { no: "12264", name: "Pune AC Duronto Express", type: "", timeFrom: "6:16 AM", timeTo: "9:40 PM", nextDay: "", duration: "15h 24m", changes: "0 changes", priceRange: "₹3,201 - ₹5,276", classes: "3A, 2A, 1A", status: "WL seats" },
  { no: "12215", name: "Bandra Terminus Garib Rath Express", type: "", timeFrom: "9:12 AM", timeTo: "6:36 AM", nextDay: "+1 day", duration: "21h 24m", changes: "0 changes", priceRange: "₹1,201", classes: "3A", status: "WL seats" },
  { no: "12908", name: "Maharashtra Sampark Kranti Express", type: "", timeFrom: "4:30 PM", timeTo: "8:23 AM", nextDay: "+1 day", duration: "15h 53m", changes: "0 changes", priceRange: "₹668 - ₹2,376", classes: "SL, 3A, 2A", status: "WL seats" },
  { no: "22452", name: "Bandra Terminus SF Express", type: "", timeFrom: "4:32 PM", timeTo: "2:12 PM", nextDay: "+1 day", duration: "21h 40m", changes: "0 changes", priceRange: "₹658 - ₹3,911", classes: "3A, 2A, 1A", status: "WL seats" },
  { no: "12926", name: "Paschim SF Express", type: "", timeFrom: "4:35 PM", timeTo: "1:38 PM", nextDay: "+1 day", duration: "21h 3m", changes: "0 changes", priceRange: "₹673 - ₹4,006", classes: "SL, 3A, 2A, 1A", status: "WL seats" },
  { no: "19020", name: "Bandra Terminus Express", type: "", timeFrom: "6:55 PM", timeTo: "9:27 PM", nextDay: "+1 day", duration: "26h 32m", changes: "0 changes", priceRange: "₹603 - ₹3,881", classes: "SL, 3A, 2A, 1A", status: "WL seats" },
  { no: "11058", name: "Mumbai CSMT Express", type: "", timeFrom: "8:40 PM", timeTo: "12:05 AM", nextDay: "+2 days", duration: "27h 25m", changes: "0 changes", priceRange: "₹698 - ₹2,546", classes: "SL, 2A", status: "WL seats" },
  { no: "22918", name: "Bandra Terminus SF Express", type: "", timeFrom: "10:15 PM", timeTo: "3:57 PM", nextDay: "+1 day", duration: "17h 42m", changes: "0 changes", priceRange: "₹668 - ₹3,956", classes: "SL, 3A, 2A", status: "WL seats" },
];

function typeWriter(elementId, text, callback) {
  const el = document.getElementById(elementId);
  if (!el) return callback ? callback() : null;
  el.textContent = '';
  let index = 0;
  const timer = setInterval(() => {
    el.textContent += text[index];
    index++;
    if (index >= text.length) {
      clearInterval(timer);
      if (callback) callback();
    }
  }, 40);
}

function startTrainAutofillDemo() {
  const btn = document.getElementById('trains-autofill-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  }

  const fromEl   = document.getElementById('train-from-text');
  const toEl     = document.getElementById('train-to-text');
  const dateEl   = document.getElementById('train-date-text');
  const returnEl = document.getElementById('train-return-text');
  const classEl  = document.getElementById('train-class-text');
  const quotaEl  = document.getElementById('train-quota-text');

  const textEls = [fromEl, toEl, dateEl, returnEl, classEl, quotaEl].filter(Boolean);

  gsap.to(textEls, {
    opacity: 0, y: -8, duration: 0.3, stagger: 0.04,
    onComplete: () => {
      textEls.forEach(el => { el.textContent = ''; });
      gsap.set(textEls, { y: 0, opacity: 1 });

      if (fromEl)   { fromEl.classList.remove('text-gray-400');   fromEl.classList.add('text-gray-800'); }
      if (toEl)     { toEl.classList.remove('text-gray-400');     toEl.classList.add('text-gray-800'); }
      if (returnEl) { returnEl.classList.remove('text-gray-400'); returnEl.classList.add('text-gray-800'); }

      typeWriter('train-from-text', 'NDLS — New Delhi (all stations)', () => {
        setTimeout(() => {
          typeWriter('train-to-text', 'MMCT — Mumbai Central (all stations)', () => {
            setTimeout(() => {
              typeWriter('train-date-text', 'Thu 25 Jun \'26', () => {
                setTimeout(() => {
                  typeWriter('train-return-text', 'Sun 28 Jun \'26', () => {
                    setTimeout(() => {
                      typeWriter('train-class-text', '3rd AC (3A)', () => {
                        setTimeout(() => {
                          typeWriter('train-quota-text', 'Person With Disability', () => {
                            setTimeout(() => {
                              if (btn) {
                                btn.disabled = false;
                                btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles animate-pulse"></i>';
                              }
                              showTrainResults();
                            }, 500);
                          });
                        }, 150);
                      });
                    }, 150);
                  });
                }, 150);
              });
            }, 150);
          });
        }, 150);
      });
    }
  });
}

function showTrainResults() {
  const container = document.getElementById('train-results-container');
  const list = document.getElementById('train-results-list');
  if (!container || !list) return;

  list.innerHTML = '';

  trainData.forEach(train => {
    const card = document.createElement('div');
    card.className = 'train-card bg-gray-50 hover:bg-indigo-50/20 border border-gray-200/80 rounded-2xl p-4 transition-all cursor-pointer group/card flex flex-col gap-3 shadow-sm hover:shadow-md';

    const classList = train.classes.split(',').map(c => `
      <span class="px-2.5 py-1 bg-white text-gray-700 text-xs font-bold rounded-lg border border-gray-200 shadow-sm">${c.trim()}</span>
    `).join('');

    card.innerHTML = `
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs bg-[#2d2383]/10 text-[#2d2383] px-2.5 py-1 rounded-lg font-bold">${train.no}</span>
          <h4 class="font-bold text-gray-900 text-base group-hover/card:text-[#2d2383] transition-colors">${train.name}</h4>
          ${train.type ? `<span class="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">${train.type}</span>` : ''}
        </div>
        <div class="text-right">
          <div class="text-[10px] text-gray-400">Starts from</div>
          <div class="text-base font-extrabold text-[#2d2383]">${train.priceRange.split('-')[0].trim()}</div>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
        <div class="flex items-center gap-6">
          <div>
            <div class="text-base font-bold text-gray-900">${train.timeFrom}</div>
            <div class="text-[10px] text-gray-400">New Delhi (NDLS)</div>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-gray-500 font-bold tracking-wide">${train.duration}</span>
            <div class="w-16 h-[2px] bg-gray-300 relative my-1">
              <i class="fa-solid fa-circle text-[6px] text-gray-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></i>
            </div>
            <span class="text-[9px] text-gray-400 uppercase">${train.changes}</span>
          </div>
          <div>
            <div class="text-base font-bold text-gray-900">${train.timeTo} ${train.nextDay ? `<span class="text-xs text-red-500 font-medium">${train.nextDay}</span>` : ''}</div>
            <div class="text-[10px] text-gray-400">Mumbai Central (MMCT)</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${classList}
          <div class="w-8 h-8 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center text-gray-500 transition-colors ml-2">
            <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300 group-hover/card:translate-y-[1px]"></i>
          </div>
        </div>
      </div>
      <div class="train-details-expand hidden border-t border-dashed border-gray-200 pt-3 mt-1">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-inner">
          <div>
            <span class="text-xs font-semibold text-gray-500 block mb-1">Availability Status</span>
            <span class="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit">
              <i class="fa-solid fa-clock text-xs"></i> ${train.status} – ${train.classes}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[10px] text-gray-400 block">Estimated Fare</span>
              <span class="text-sm font-bold text-gray-900">${train.priceRange}</span>
            </div>
            <button onclick="event.stopPropagation(); alert('Booking initiated for Train ${train.no} - ${train.name}')" class="primary-color hover:bg-[#1e175a] text-white text-xs px-5 py-2.5 rounded-lg font-bold shadow transition-all">
              Book Tickets
            </button>
          </div>
        </div>
      </div>`;

    card.addEventListener('click', () => {
      const details = card.querySelector('.train-details-expand');
      const arrow = card.querySelector('.fa-chevron-down');
      const isHidden = details.classList.contains('hidden');

      list.querySelectorAll('.train-details-expand').forEach(d => {
        if (d !== details) d.classList.add('hidden');
      });
      list.querySelectorAll('.fa-chevron-down').forEach(a => {
        if (a !== arrow) a.style.transform = 'rotate(0deg)';
      });

      if (isHidden) {
        details.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        gsap.fromTo(details,
          { opacity: 0, height: 0 },
          { opacity: 1, height: 'auto', duration: 0.35, ease: 'power2.out' }
        );
      } else {
        gsap.to(details, {
          opacity: 0, height: 0, duration: 0.25, ease: 'power2.in',
          onComplete: () => details.classList.add('hidden'),
        });
        arrow.style.transform = 'rotate(0deg)';
      }
    });

    list.appendChild(card);
  });

  container.classList.remove('hidden');
  gsap.fromTo(container,
    { opacity: 0, y: 30, scale: 0.98 },
    { opacity: 1, y: 0,  scale: 1,    duration: 0.5, ease: 'power2.out' }
  );
  gsap.fromTo(list.children,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0,  duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
  );
  setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

window.startTrainAutofillDemo = startTrainAutofillDemo;
window.showTrainResults = showTrainResults;
