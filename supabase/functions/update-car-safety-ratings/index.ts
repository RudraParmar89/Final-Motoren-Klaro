import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SafetyRating {
  brand: string;
  model: string;
  rating: number;
}

// Collected safety ratings from research
const safetyRatings: SafetyRating[] = [
  // BMW
  { brand: 'BMW', model: '2 Series Gran Coupe', rating: 5 },
  { brand: 'BMW', model: '3 Series Gran Limousine', rating: 5 },
  { brand: 'BMW', model: '5 Series', rating: 5 },
  { brand: 'BMW', model: '7 Series', rating: 5 },
  { brand: 'BMW', model: 'i4', rating: 5 },
  { brand: 'BMW', model: 'i5', rating: 5 },
  { brand: 'BMW', model: 'iX', rating: 5 },
  { brand: 'BMW', model: 'M340i', rating: 5 },
  { brand: 'BMW', model: 'X1', rating: 5 },
  { brand: 'BMW', model: 'X5', rating: 5 },
  { brand: 'BMW', model: 'X7', rating: 5 },
  { brand: 'BMW', model: 'XM', rating: 5 },
  
  // Kia
  { brand: 'Kia', model: 'Seltos', rating: 3 },
  { brand: 'Kia', model: 'Carens', rating: 3 },
  { brand: 'Kia', model: 'Sonet', rating: 3 },
  { brand: 'Kia', model: 'Carnival', rating: 3 },
  { brand: 'Kia', model: 'EV6', rating: 5 },
  { brand: 'Kia', model: 'EV9', rating: 5 },
  { brand: 'Kia', model: 'Syros', rating: 3 },
  
  // Tata
  { brand: 'Tata', model: 'Nexon', rating: 5 },
  { brand: 'Tata', model: 'Harrier', rating: 5 },
  { brand: 'Tata', model: 'Safari', rating: 5 },
  { brand: 'Tata', model: 'Punch', rating: 5 },
  { brand: 'Tata', model: 'Tiago', rating: 4 },
  { brand: 'Tata', model: 'Altroz', rating: 5 },
  { brand: 'Tata', model: 'Tigor', rating: 4 },
  { brand: 'Tata', model: 'Curvv', rating: 5 },
  
  // Suzuki/Maruti
  { brand: 'Suzuki', model: 'Swift', rating: 3 },
  { brand: 'Suzuki', model: 'Baleno', rating: 3 },
  { brand: 'Suzuki', model: 'Brezza', rating: 4 },
  { brand: 'Suzuki', model: 'Ertiga', rating: 3 },
  { brand: 'Suzuki', model: 'Grand Vitara', rating: 4 },
  { brand: 'Suzuki', model: 'Fronx', rating: 4 },
  { brand: 'Suzuki', model: 'Jimny', rating: 3 },
  
  // Land Rover / Range Rover
  { brand: 'Land Rover', model: 'Defender', rating: 5 },
  { brand: 'Land Rover', model: 'Discovery', rating: 5 },
  { brand: 'Land Rover', model: 'Discovery Sport', rating: 5 },
  { brand: 'Land Rover', model: 'Range Rover', rating: 5 },
  { brand: 'Land Rover', model: 'Range Rover Sport', rating: 5 },
  { brand: 'Land Rover', model: 'Range Rover Evoque', rating: 5 },
  { brand: 'Land Rover', model: 'Range Rover Velar', rating: 5 },
  
  // Jaguar
  { brand: 'Jaguar', model: 'F-PACE', rating: 5 },
  { brand: 'Jaguar', model: 'E-PACE', rating: 5 },
  { brand: 'Jaguar', model: 'I-PACE', rating: 5 },
  { brand: 'Jaguar', model: 'F-Type', rating: 5 },
  { brand: 'Jaguar', model: 'XF', rating: 5 },
  { brand: 'Jaguar', model: 'XJ', rating: 5 },
  
  // Hyundai
  { brand: 'Hyundai', model: 'Creta', rating: 3 },
  { brand: 'Hyundai', model: 'Venue', rating: 3 },
  { brand: 'Hyundai', model: 'Verna', rating: 3 },
  { brand: 'Hyundai', model: 'i20', rating: 3 },
  { brand: 'Hyundai', model: 'Tucson', rating: 5 },
  { brand: 'Hyundai', model: 'Alcazar', rating: 3 },
  { brand: 'Hyundai', model: 'Exter', rating: 3 },
  { brand: 'Hyundai', model: 'Ioniq 5', rating: 5 },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    let updatedCount = 0;
    const results = [];

    // Update each car's safety rating
    for (const rating of safetyRatings) {
      const { data, error } = await supabaseClient
        .from('cars')
        .update({ ncap_rating: rating.rating })
        .eq('brand', rating.brand)
        .eq('model', rating.model)
        .select();

      if (error) {
        console.error(`Error updating ${rating.brand} ${rating.model}:`, error);
        results.push({
          car: `${rating.brand} ${rating.model}`,
          status: 'error',
          error: error.message
        });
      } else if (data && data.length > 0) {
        updatedCount += data.length;
        results.push({
          car: `${rating.brand} ${rating.model}`,
          status: 'updated',
          rating: rating.rating,
          count: data.length
        });
      } else {
        results.push({
          car: `${rating.brand} ${rating.model}`,
          status: 'not_found'
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updatedCount,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})