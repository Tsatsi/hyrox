export const WORKOUT_WEEK = [
  {
    day: 'Monday',
    short: 'Mon',
    focus: 'Lower Body Strength',
    objective: 'Build posterior chain power for sled push & wall balls',
    exercises: [
      { name: 'Back Squats', detail: '4×8 @ 80% 1RM' },
      { name: 'Romanian Deadlifts', detail: '3×10' },
      { name: 'Walking Lunges', detail: '3×20 steps' },
      { name: 'Calf Raises', detail: '4×15' },
    ],
    zone: 'Strength',
  },
  {
    day: 'Tuesday',
    short: 'Tue',
    focus: 'Aerobic Endurance',
    objective: 'Develop aerobic base at altitude (1,750m Nasrec)',
    exercises: [
      { name: 'Zone 2 Run', detail: '60 min, nasal breathing, 60–70% max HR' },
      { name: 'Mobility Work', detail: '15 min hip & ankle' },
    ],
    zone: 'Zone 2',
  },
  {
    day: 'Wednesday',
    short: 'Wed',
    focus: 'Lactate Threshold Intervals',
    objective: 'Raise anaerobic threshold for sustained race-pace effort',
    exercises: [
      { name: '6×800m', detail: 'At race pace, 2 min rest between' },
      { name: 'Cool-down', detail: '10 min easy jog' },
    ],
    zone: 'Threshold',
  },
  {
    day: 'Thursday',
    short: 'Thu',
    focus: 'Upper Body Strength & Grip',
    objective: 'Build pulling strength for ski erg & rope climb stations',
    exercises: [
      { name: 'Weighted Pull-ups', detail: '4×6' },
      { name: 'Overhead Press', detail: '4×8' },
      { name: "Farmer's Carry", detail: '4×30m @ heavy' },
      { name: 'Ring Rows', detail: '3×12' },
    ],
    zone: 'Strength',
  },
  {
    day: 'Friday',
    short: 'Fri',
    focus: 'Active Recovery',
    objective: 'Flush fatigue, maintain movement quality',
    exercises: [
      { name: 'Zone 1 Cardio', detail: '30 min easy bike or swim' },
      { name: 'Mobility & Foam Rolling', detail: '20 min full body' },
    ],
    zone: 'Recovery',
  },
  {
    day: 'Saturday',
    short: 'Sat',
    focus: 'Compromised Running Simulation',
    objective: 'Train running under fatigue — the HYROX race pattern',
    exercises: [
      { name: '4–6 Rounds', detail: '1km run → 25m sled push → 15 burpee broad jumps → 15 wall balls' },
      { name: 'Pace target', detail: '10–15 sec/km slower than sea-level pace (altitude adj.)' },
    ],
    zone: 'Race Sim',
  },
  {
    day: 'Sunday',
    short: 'Sun',
    focus: 'Passive Recovery',
    objective: 'Full CNS reset before next training week',
    exercises: [
      { name: 'Rest', detail: 'No training. Hydration 3.5–4.5 L. Sleep 8–9 hrs.' },
    ],
    zone: 'Rest',
  },
]

export const ZONE_COLORS = {
  'Strength': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Zone 2': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Threshold': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Race Sim': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Recovery': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Rest': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}
