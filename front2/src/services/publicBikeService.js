import api from "../api/axios";
import {
  BIKE_HERO_STATS,
  STATIONS_MOCK,
  HOURLY_USAGE,
  MONTHLY_USAGE,
  TOP_STATIONS,
  AGE_DISTRIBUTION,
  AI_INSIGHTS,
  ROUTES_MOCK,
} from "../constants/mockData";

// 향후 FastAPI: GET /api/bike/seoul/summary
async function getSummary() {
  try {
    const { data } = await api.get("/bike/seoul/summary");
    return data;
  } catch {
    return BIKE_HERO_STATS;
  }
}

// 향후 FastAPI: GET /api/bike/seoul/routes
async function getBikeRoutes() {
  try {
    const { data } = await api.get("/bike/seoul/routes");
    return data;
  } catch {
    return ROUTES_MOCK.filter((r) => r.bikeType === "따릉이");
  }
}

// 향후 FastAPI: GET /api/bike/seoul/stations
async function getStations() {
  try {
    const { data } = await api.get("/bike/seoul/stations");
    return data;
  } catch {
    return { stations: STATIONS_MOCK, hourlyUsage: HOURLY_USAGE };
  }
}

// 향후 FastAPI: GET /api/ai/bike/analysis
async function getAnalysis() {
  try {
    const { data } = await api.get("/ai/bike/analysis");
    return data;
  } catch {
    return {
      monthlyUsage: MONTHLY_USAGE,
      topStations: TOP_STATIONS,
      ageDistribution: AGE_DISTRIBUTION,
      insights: AI_INSIGHTS,
    };
  }
}

// FastAPI ML 예측 엔드포인트 (아직 백엔드 미구현 — UI/Request 스키마만 준비된 상태).
// day_of_week/month/is_weekend은 date에서 서버 측 preprocessing으로 파생하도록 하고
// 여기서는 보내지 않는다(학습·추론 preprocessing 일치를 위해 파생 로직을 한 곳에만 둠).
// 실패(백엔드 부재 등) 시 가짜 예측값을 만들지 않고 에러를 그대로 전달한다.
async function getForecast({
  stationId,
  date,
  hour,
  isHoliday,
  temperature,
  humidity,
  rainfall,
  windSpeed,
  recentHourlyRentals,
  prevDaySameHourRentals,
  rolling7dSameHourAvg,
}) {
  const { data } = await api.post("/ai/bike/forecast", {
    station_id: stationId,
    date,
    hour,
    is_holiday: isHoliday ? 1 : 0,
    temperature,
    humidity,
    rainfall,
    wind_speed: windSpeed,
    recent_1h_rental_count: recentHourlyRentals,
    prev_day_same_hour_rental_count: prevDaySameHourRentals,
    rolling_7d_same_hour_avg: rolling7dSameHourAvg,
  });
  return data;
}

const publicBikeService = { getSummary, getBikeRoutes, getStations, getAnalysis, getForecast };
export default publicBikeService;
