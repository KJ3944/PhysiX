/**
 * PhysiX — Multi-Experiment 50-Question Bank & Dynamic Shuffler
 * 
 * Includes 50 verified physics questions for:
 *  - Experiment 1: 2D Projectile Motion
 *  - Experiment 2: Optical Fibre Numerical Aperture (TIR)
 *  - Experiment 3: Colour Sensor (TCS3200 & RGB Photometry)
 * 
 * Generates dynamic 10-question quizzes with full randomization and option-shuffling
 * so no two attempts have the same question pattern or option ordering.
 */

export const PROJECTILE_QUESTION_BANK = {
  title: "2D Projectile Motion - Question Bank",
  experimentId: "projectile",
  quizId: "projectile-mastery-quiz",
  experimentName: "2D Projectile Motion",
  total_questions: 50,
  questions: [
    {
      id: 1,
      question: "What is projectile motion?",
      options: [
        "Motion of an object under gravity after projection",
        "Motion only in a circle",
        "Motion without gravity",
        "Motion only vertically"
      ],
      answer: "A",
      correct_option: "Motion of an object under gravity after projection",
      difficulty: "easy",
      global_id: 1,
      explanation: "A projectile is an object upon which the only significant acting force is gravity after launch."
    },
    {
      id: 2,
      question: "What is the horizontal acceleration of an ideal projectile?",
      options: [
        "Zero",
        "g",
        "2g",
        "g/2"
      ],
      answer: "A",
      correct_option: "Zero",
      difficulty: "easy",
      global_id: 2,
      explanation: "Neglecting air resistance, no horizontal forces act on the projectile (ΣFx = 0), so ax = 0."
    },
    {
      id: 3,
      question: "What is the vertical acceleration of an ideal projectile?",
      options: [
        "g downward",
        "Zero",
        "g upward",
        "2g upward"
      ],
      answer: "A",
      correct_option: "g downward",
      difficulty: "easy",
      global_id: 3,
      explanation: "Gravity exerts a constant downward force (F = mg), producing a downward acceleration of ay = -g."
    },
    {
      id: 4,
      question: "Which force acts on an ideal projectile after release?",
      options: [
        "Gravity",
        "Friction only",
        "Magnetic force only",
        "Electric force only"
      ],
      answer: "A",
      correct_option: "Gravity",
      difficulty: "easy",
      global_id: 4,
      explanation: "In classical ideal projectile dynamics, gravity is the sole force acting during flight."
    },
    {
      id: 5,
      question: "The path of an ideal projectile is a:",
      "options": [
        "Parabola",
        "Circle",
        "Straight line always",
        "Ellipse always"
      ],
      answer: "A",
      correct_option: "Parabola",
      difficulty: "easy",
      global_id: 5,
      explanation: "The equation y = (tanθ)x - (g/(2v₀²cos²θ))x² is quadratic in x, representing a parabolic trajectory."
    },
    {
      id: 6,
      question: "At the highest point of projectile motion, vertical velocity is:",
      "options": [
        "Zero",
        "Maximum",
        "Equal to g",
        "Negative maximum"
      ],
      answer: "A",
      correct_option: "Zero",
      difficulty: "easy",
      global_id: 6,
      explanation: "At the apex peak, the projectile momentarily transitions between upward rise and downward fall (vy = 0)."
    },
    {
      id: 7,
      question: "Horizontal velocity of an ideal projectile is:",
      "options": [
        "Constant",
        "Zero throughout",
        "Increasing",
        "Decreasing"
      ],
      answer: "A",
      correct_option: "Constant",
      difficulty: "easy",
      global_id: 7,
      explanation: "Because ax = 0, horizontal velocity vx = v₀ cosθ remains constant throughout the entire trajectory."
    },
    {
      id: 8,
      question: "The SI unit of acceleration due to gravity is:",
      "options": [
        "m/s²",
        "m/s",
        "N",
        "J"
      ],
      answer: "A",
      correct_option: "m/s²",
      difficulty: "easy",
      global_id: 8,
      explanation: "Acceleration measures the rate of change of velocity per second, giving units of m/s²."
    },
    {
      id: 9,
      question: "If a projectile is launched horizontally, its initial vertical velocity is:",
      "options": [
        "Zero",
        "Equal to horizontal velocity",
        "g",
        "Maximum"
      ],
      answer: "A",
      correct_option: "Zero",
      difficulty: "easy",
      global_id: 9,
      explanation: "For horizontal launch (θ = 0°), v₀y = v₀ sin(0°) = 0 m/s."
    },
    {
      id: 10,
      question: "For a projectile returning to the same height, time of ascent is:",
      "options": [
        "Equal to time of descent",
        "Twice time of descent",
        "Half time of descent",
        "Always zero"
      ],
      answer: "A",
      correct_option: "Equal to time of descent",
      difficulty: "easy",
      global_id: 10,
      explanation: "Symmetry of constant acceleration under gravity ensures tascent = tdescent = (v₀ sinθ)/g."
    },
    {
      id: 11,
      question: "At the highest point, the acceleration of a projectile is:",
      "options": [
        "g downward",
        "Zero",
        "g upward",
        "Horizontal"
      ],
      answer: "A",
      correct_option: "g downward",
      difficulty: "easy",
      global_id: 11,
      explanation: "Gravity does not disappear at the apex; acceleration remains constant at g downward."
    },
    {
      id: 12,
      question: "Range means:",
      "options": [
        "Horizontal distance travelled",
        "Maximum vertical height",
        "Time taken to rise",
        "Initial speed"
      ],
      answer: "A",
      correct_option: "Horizontal distance travelled",
      difficulty: "easy",
      global_id: 12,
      explanation: "The horizontal range R is the total displacement along the x-axis from launch to landing."
    },
    {
      id: 13,
      question: "Maximum height means:",
      "options": [
        "Greatest vertical displacement above launch level",
        "Horizontal distance",
        "Total distance",
        "Time of flight"
      ],
      answer: "A",
      correct_option: "Greatest vertical displacement above launch level",
      difficulty: "easy",
      global_id: 13,
      explanation: "Hmax is the peak vertical coordinate reached along the trajectory."
    },
    {
      id: 14,
      question: "Time of flight is the:",
      "options": [
        "Total time projectile remains in air",
        "Time to reach maximum height only",
        "Horizontal distance",
        "Initial velocity"
      ],
      answer: "A",
      correct_option: "Total time projectile remains in air",
      difficulty: "easy",
      global_id: 14,
      explanation: "Time of flight T is the total duration between launch and touchdown."
    },
    {
      id: 15,
      question: "The horizontal component of initial velocity is:",
      "options": [
        "u cosθ",
        "u sinθ",
        "u tanθ",
        "u/g"
      ],
      answer: "A",
      correct_option: "u cosθ",
      difficulty: "easy",
      global_id: 15,
      explanation: "By trigonometry on the launch velocity vector, ux = u cosθ."
    },
    {
      id: 16,
      question: "The vertical component of initial velocity is:",
      "options": [
        "u sinθ",
        "u cosθ",
        "u/g",
        "u tanθ"
      ],
      answer: "A",
      correct_option: "u sinθ",
      difficulty: "easy",
      global_id: 16,
      explanation: "By trigonometry on the launch velocity vector, uy = u sinθ."
    },
    {
      id: 17,
      question: "At a launch angle of 0°, the projectile is launched:",
      "options": [
        "Horizontally",
        "Vertically upward",
        "Vertically downward",
        "At 45°"
      ],
      answer: "A",
      correct_option: "Horizontally",
      difficulty: "easy",
      global_id: 17,
      explanation: "0° relative to horizontal represents pure horizontal launch."
    },
    {
      id: 18,
      question: "At a launch angle of 90°, the projectile is launched:",
      "options": [
        "Vertically upward",
        "Horizontally",
        "At 45°",
        "Downward horizontally"
      ],
      answer: "A",
      correct_option: "Vertically upward",
      difficulty: "easy",
      global_id: 18,
      explanation: "90° relative to horizontal corresponds to straight vertical projection."
    },
    {
      id: 19,
      question: "Ignoring air resistance, the trajectory depends on:",
      "options": [
        "Initial velocity and gravity",
        "Mass only",
        "Colour only",
        "Temperature only"
      ],
      "answer": "A",
      "correct_option": "Initial velocity and gravity",
      difficulty: "easy",
      global_id: 19,
      explanation: "Under ideal Newtonian mechanics, mass cancels out in F = mg = ma, leaving motion governed purely by u, θ, and g."
    },
    {
      id: 20,
      question: "The acceleration due to gravity is approximately:",
      "options": [
        "9.8 m/s²",
        "98 m/s²",
        "0.98 m/s²",
        "1 m/s² exactly"
      ],
      "answer": "A",
      "correct_option": "9.8 m/s²",
      difficulty: "easy",
      global_id: 20,
      explanation: "Standard sea-level Earth gravitational acceleration is g ≈ 9.80665 m/s²."
    },
    {
      id: 21,
      question: "Which equation gives horizontal displacement for a projectile?",
      "options": [
        "x = (u cosθ)t",
        "x = ut²",
        "x = gt",
        "x = u sinθ"
      ],
      "answer": "A",
      "correct_option": "x = (u cosθ)t",
      difficulty: "medium",
      global_id: 21,
      explanation: "Since horizontal acceleration is zero, displacement is simply velocity × time: x = (u cosθ)t."
    },
    {
      id: 22,
      question: "Which equation gives vertical displacement from launch level?",
      "options": [
        "y = (u sinθ)t − ½gt²",
        "y = ut",
        "y = u cosθ",
        "y = gt²"
      ],
      "answer": "A",
      "correct_option": "y = (u sinθ)t − ½gt²",
      difficulty: "medium",
      "global_id": 22,
      explanation: "From kinematic equation s = ut + ½at² with a = -g and uy = u sinθ."
    },
    {
      id: 23,
      question: "For a projectile landing at the same height, time of flight is:",
      "options": [
        "2u sinθ/g",
        "u cosθ/g",
        "u² sinθ/g",
        "2u cosθ/g"
      ],
      "answer": "A",
      "correct_option": "2u sinθ/g",
      difficulty: "medium",
      "global_id": 23,
      explanation: "Setting y = 0 gives (u sinθ)t - ½gt² = 0 => t = 2u sinθ / g."
    },
    {
      id: 24,
      question: "For same-level projection, horizontal range is:",
      "options": [
        "u² sin2θ/g",
        "u² cosθ/g",
        "u sinθ/g",
        "2u/g"
      ],
      "answer": "A",
      "correct_option": "u² sin2θ/g",
      difficulty: "medium",
      "global_id": 24,
      explanation: "R = vx × T = (u cosθ)(2u sinθ / g) = (u² / g) (2 sinθ cosθ) = u² sin(2θ) / g."
    },
    {
      id: 25,
      question: "Maximum height for a same-level projectile is:",
      "options": [
        "u²sin²θ/(2g)",
        "u²cos²θ/g",
        "u sinθ/g",
        "u²/g²"
      ],
      "answer": "A",
      "correct_option": "u²sin²θ/(2g)",
      difficulty: "medium",
      "global_id": 25,
      explanation: "From vy² = uy² - 2gH => 0 = (u sinθ)² - 2gH => H = u² sin²θ / (2g)."
    },
    {
      id: 26,
      question: "For a fixed launch speed, maximum range occurs at:",
      "options": [
        "45°",
        "30°",
        "60°",
        "90°"
      ],
      "answer": "A",
      "correct_option": "45°",
      difficulty: "medium",
      "global_id": 26,
      explanation: "sin(2θ) reaches its maximum value of 1.0 when 2θ = 90°, so θ = 45°."
    },
    {
      id: 27,
      question: "Angles θ and (90°−θ) with the same speed give:",
      "options": [
        "Same range",
        "Same maximum height",
        "Same time of flight",
        "Zero range"
      ],
      "answer": "A",
      "correct_option": "Same range",
      difficulty: "medium",
      "global_id": 27,
      explanation: "Since sin(2(90°-θ)) = sin(180°-2θ) = sin(2θ), complementary angles yield identical range."
    },
    {
      id: 28,
      question: "At the highest point, the projectile's speed equals:",
      "options": [
        "Horizontal component of velocity",
        "Vertical component only",
        "Zero always",
        "g"
      ],
      "answer": "A",
      "correct_option": "Horizontal component of velocity",
      "difficulty": "medium",
      "global_id": 28,
      explanation: "At apex, vy = 0, so vtotal = √(vx² + 0) = vx = u cosθ."
    },
    {
      id: 29,
      question: "If initial speed is doubled at the same angle, ideal range becomes:",
      "options": [
        "Four times",
        "Two times",
        "Half",
        "Unchanged"
      ],
      "answer": "A",
      "correct_option": "Four times",
      difficulty: "medium",
      "global_id": 29,
      explanation: "Range is proportional to the square of initial velocity (R ∝ u²). (2u)² = 4u²."
    },
    {
      id: 30,
      question: "If initial speed is doubled at the same angle, maximum height becomes:",
      "options": [
        "Four times",
        "Two times",
        "Half",
        "Unchanged"
      ],
      "answer": "A",
      "correct_option": "Four times",
      difficulty: "medium",
      "global_id": 30,
      explanation: "Hmax is proportional to u² (H ∝ u²). Doubling speed quadruples peak height."
    },
    {
      id: 31,
      question: "If g increases while u and θ stay fixed, time of flight:",
      "options": [
        "Decreases",
        "Increases",
        "Stays exactly same",
        "Becomes infinite"
      ],
      "answer": "A",
      "correct_option": "Decreases",
      difficulty: "medium",
      "global_id": 31,
      explanation: "Since T = 2u sinθ / g, time of flight is inversely proportional to g."
    },
    {
      id: 32,
      question: "If g increases while u and θ stay fixed, maximum height:",
      "options": [
        "Decreases",
        "Increases",
        "Stays same",
        "Becomes infinite"
      ],
      "answer": "A",
      "correct_option": "Decreases",
      difficulty: "medium",
      "global_id": 32,
      explanation: "Hmax = u² sin²θ / (2g); stronger gravity decelerates upward velocity faster, reducing peak height."
    },
    {
      id: 33,
      question: "At the same height during ascent and descent, vertical velocity components are:",
      "options": [
        "Equal in magnitude and opposite in direction",
        "Equal and same direction",
        "Both zero",
        "Always different in magnitude"
      ],
      "answer": "A",
      "correct_option": "Equal in magnitude and opposite in direction",
      difficulty: "medium",
      "global_id": 33,
      explanation: "Conservation of mechanical energy dictates equal speeds at equal elevations, with opposite signs for vy."
    },
    {
      id: 34,
      "question": "The horizontal velocity at landing, neglecting air resistance, is:",
      "options": [
        "Same as initial horizontal velocity",
        "Zero",
        "Double initial horizontal velocity",
        "Opposite initial horizontal velocity"
      ],
      "answer": "A",
      "correct_option": "Same as initial horizontal velocity",
      difficulty: "medium",
      "global_id": 34,
      explanation: "With ax = 0, vx remains unchanged from launch to impact."
    },
    {
      id: 35,
      question: "The velocity of a projectile at any instant has:",
      "options": [
        "Horizontal and vertical components",
        "Only vertical component",
        "Only horizontal component",
        "No components"
      ],
      "answer": "A",
      "correct_option": "Horizontal and vertical components",
      "difficulty": "medium",
      "global_id": 35,
      explanation: "2D motion is resolved into two orthogonal 1D components: vx and vy."
    },
    {
      id: 36,
      question: "For θ = 45° and u = 10 m/s, approximate range using g = 10 m/s² is:",
      "options": [
        "10 m",
        "5 m",
        "20 m",
        "100 m"
      ],
      "answer": "A",
      "correct_option": "10 m",
      difficulty: "medium",
      "global_id": 36,
      explanation: "R = (10² × sin(90°)) / 10 = (100 × 1) / 10 = 10 m."
    },
    {
      id: 37,
      question: "For θ = 90° in same-level range formula, range is:",
      "options": [
        "Zero",
        "Maximum",
        "u²/g",
        "2u²/g"
      ],
      "answer": "A",
      "correct_option": "Zero",
      "difficulty": "medium",
      "global_id": 37,
      explanation: "R = (u² sin(180°)) / g = 0 m, because the projectile travels straight up and down on the spot."
    },
    {
      id: 38,
      question: "A projectile's vertical velocity changes because of:",
      "options": [
        "Gravity",
        "Horizontal motion",
        "Its mass only",
        "Its colour"
      ],
      "answer": "A",
      "correct_option": "Gravity",
      "difficulty": "medium",
      "global_id": 38,
      explanation: "Gravitational force provides the continuous vertical acceleration."
    },
    {
      id: 39,
      question: "The slope of a projectile trajectory at any point represents:",
      "options": [
        "vy/vx",
        "vx/vy",
        "g/u",
        "u/g"
      ],
      "answer": "A",
      "correct_option": "vy/vx",
      "difficulty": "medium",
      "global_id": 39,
      explanation: "dy/dx = (dy/dt) / (dx/dt) = vy / vx = tan(instantaneous angle)."
    },
    {
      id: 40,
      question: "The equation of trajectory for same-origin projection is:",
      "options": [
        "y = x tanθ − gx²/(2u²cos²θ)",
        "y = x + u",
        "y = gt²",
        "y = u²x"
      ],
      "answer": "A",
      "correct_option": "y = x tanθ − gx²/(2u²cos²θ)",
      "difficulty": "medium",
      "global_id": 40,
      explanation: "Eliminating t = x/(u cosθ) from y = (u sinθ)t - ½gt² yields the standard Cartesian trajectory formula."
    },
    {
      id: 41,
      question: "A projectile has maximum range R. If its launch speed is doubled, the new maximum range is:",
      "options": [
        "4R",
        "2R",
        "R/2",
        "R"
      ],
      "answer": "A",
      "correct_option": "4R",
      "difficulty": "hard",
      "global_id": 41,
      explanation: "Rmax = u²/g. Doubling u to 2u yields (2u)²/g = 4(u²/g) = 4R."
    },
    {
      id: 42,
      question: "Two complementary angles have the same range because:",
      "options": [
        "sin(2θ) is the same",
        "cosθ is always zero",
        "Their heights are equal",
        "Their times are always equal"
      ],
      "answer": "A",
      "correct_option": "sin(2θ) is the same",
      "difficulty": "hard",
      "global_id": 42,
      explanation: "sin(2(90°-θ)) = sin(180°-2θ) = sin(2θ)."
    },
    {
      id: 43,
      question: "For a projectile launched and landing at the same height, maximum range occurs when:",
      "options": [
        "sin2θ = 1",
        "cosθ = 1",
        "sinθ = 0",
        "tanθ = 0"
      ],
      "answer": "A",
      "correct_option": "sin2θ = 1",
      "difficulty": "hard",
      "global_id": 43,
      explanation: "Maximum of sin(2θ) is 1, which occurs at 2θ = 90° => θ = 45°."
    },
    {
      id: 44,
      question: "At the highest point of a projectile, which statement is correct?",
      "options": [
        "vy = 0 but acceleration is still g downward",
        "Both velocity and acceleration are zero",
        "vx = 0 and acceleration is zero",
        "Acceleration is horizontal"
      ],
      "answer": "A",
      "correct_option": "vy = 0 but acceleration is still g downward",
      "difficulty": "hard",
      "global_id": 44,
      explanation: "The projectile maintains horizontal velocity vx = u cosθ and experiences constant acceleration g downward."
    },
    {
      id: 45,
      question: "A projectile is launched with u = 20 m/s at 30°, g = 10 m/s². Its time of flight is:",
      "options": [
        "2 s",
        "1 s",
        "4 s",
        "√3 s"
      ],
      "answer": "A",
      "correct_option": "2 s",
      "difficulty": "hard",
      "global_id": 45,
      explanation: "T = 2u sinθ / g = (2 × 20 × sin(30°)) / 10 = (40 × 0.5) / 10 = 2.0 s."
    },
    {
      id: 46,
      question: "For u = 20 m/s, θ = 45°, g = 10 m/s², the range is:",
      "options": [
        "40 m",
        "20 m",
        "10 m",
        "80 m"
      ],
      "answer": "A",
      "correct_option": "40 m",
      "difficulty": "hard",
      "global_id": 46,
      explanation: "R = (20² × sin(90°)) / 10 = (400 × 1) / 10 = 40 m."
    },
    {
      id: 47,
      question: "For u = 20 m/s, θ = 30°, g = 10 m/s², maximum height is:",
      "options": [
        "5 m",
        "10 m",
        "20 m",
        "2.5 m"
      ],
      "answer": "A",
      "correct_option": "5 m",
      "difficulty": "hard",
      "global_id": 47,
      explanation: "H = u² sin²θ / (2g) = (400 × 0.25) / 20 = 100 / 20 = 5 m."
    },
    {
      id: 48,
      question: "If a projectile is launched at θ and its range is maximum, its horizontal and initial vertical velocity components are:",
      "options": [
        "Equal",
        "Opposite",
        "One is zero",
        "Both zero"
      ],
      "answer": "A",
      "correct_option": "Equal",
      "difficulty": "hard",
      "global_id": 48,
      explanation: "At θ = 45°, ux = u cos(45°) = u/√2 and uy = u sin(45°) = u/√2, so ux = uy."
    },
    {
      id: 49,
      question: "A projectile is at the same vertical level at t1 and t2. For same-level motion, the times satisfy:",
      "options": [
        "t1 + t2 = 2u sinθ/g",
        "t1t2 = 0",
        "t1 = t2 always",
        "t1 − t2 = g"
      ],
      "answer": "A",
      "correct_option": "t1 + t2 = 2u sinθ/g",
      "difficulty": "hard",
      "global_id": 49,
      explanation: "From y = (u sinθ)t - ½gt², the sum of the roots of ½gt² - (u sinθ)t + y = 0 is t1 + t2 = (u sinθ)/(½g) = 2u sinθ / g (total flight time)."
    },
    {
      id: 50,
      question: "If the range is kept fixed while g is constant, changing u generally requires changing:",
      "options": [
        "Launch angle",
        "Mass",
        "Colour",
        "Air pressure only"
      ],
      "answer": "A",
      "correct_option": "Launch angle",
      "difficulty": "hard",
      "global_id": 50,
      explanation: "Since R = u² sin(2θ) / g, if u changes, sin(2θ) and hence θ must adjust to maintain constant R."
    }
  ]
};

export const OPTICAL_FIBRE_QUESTION_BANK = {
  title: "Optical Fibre - Question Bank",
  experimentId: "optical",
  quizId: "optical-mastery-quiz",
  experimentName: "Determination of Numerical Aperture of an Optical Fibre",
  total_questions: 50,
  questions: [
    {
      id: 1,
      question: "What is the basic principle of optical fibre transmission?",
      options: [
        "Total internal reflection",
        "Photoelectric effect",
        "Diffraction only",
        "Electromagnetic induction"
      ],
      answer: "A",
      correct_option: "Total internal reflection",
      difficulty: "easy",
      global_id: 51,
      explanation: "Light signals are confined and guided inside an optical fibre by continuous total internal reflections."
    },
    {
      id: 2,
      question: "The central light-guiding region of an optical fibre is called:",
      options: [
        "Core",
        "Cladding",
        "Jacket",
        "Coating"
      ],
      answer: "A",
      correct_option: "Core",
      difficulty: "easy",
      global_id: 52,
      explanation: "The core is the inner cylindrical optical medium through which light travels."
    },
    {
      id: 3,
      question: "The layer surrounding the core is called:",
      options: [
        "Cladding",
        "Anode",
        "Cathode",
        "Terminal"
      ],
      answer: "A",
      correct_option: "Cladding",
      difficulty: "easy",
      global_id: 53,
      explanation: "The cladding wraps around the core with a slightly lower refractive index to facilitate TIR."
    },
    {
      id: 4,
      question: "The refractive index of the core is generally:",
      options: [
        "Greater than that of cladding",
        "Less than cladding",
        "Equal to air always",
        "Zero"
      ],
      answer: "A",
      correct_option: "Greater than that of cladding",
      difficulty: "easy",
      global_id: 54,
      explanation: "TIR requires light to propagate from a medium of higher refractive index (n₁) to lower index (n₂), so n₁ > n₂."
    },
    {
      id: 5,
      question: "TIR stands for:",
      options: [
        "Total Internal Reflection",
        "Total Intensity Radiation",
        "Transmitted Internal Refraction",
        "Total Infrared Response"
      ],
      answer: "A",
      correct_option: "Total Internal Reflection",
      difficulty: "easy",
      global_id: 55,
      explanation: "Total Internal Reflection is the optical phenomenon where 100% of incident light is reflected back into the denser medium."
    },
    {
      id: 6,
      question: "For TIR, light must travel from:",
      options: [
        "Optically denser to optically rarer medium",
        "Rarer to denser medium",
        "Vacuum to vacuum",
        "Any medium at any angle"
      ],
      answer: "A",
      correct_option: "Optically denser to optically rarer medium",
      difficulty: "easy",
      global_id: 56,
      explanation: "TIR can only take place when light travels from higher optical density (core) towards lower optical density (cladding)."
    },
    {
      id: 7,
      question: "The angle of incidence for TIR must be:",
      options: [
        "Greater than the critical angle",
        "Less than critical angle",
        "Always 0°",
        "Always 90°"
      ],
      answer: "A",
      correct_option: "Greater than the critical angle",
      difficulty: "easy",
      global_id: 57,
      explanation: "When θi > θc, refraction into the rarer medium cannot satisfy Snell's law, causing total reflection."
    },
    {
      id: 8,
      question: "Optical fibre is commonly used for:",
      options: [
        "Communication",
        "Measuring mass",
        "Generating mechanical power",
        "Heating rooms"
      ],
      answer: "A",
      correct_option: "Communication",
      difficulty: "easy",
      global_id: 58,
      explanation: "Optical fibres form the backbone of modern global high-speed telecommunications and internet infrastructure."
    },
    {
      id: 9,
      question: "Which material is commonly used to make optical fibres?",
      options: [
        "Glass or plastic",
        "Iron only",
        "Copper only",
        "Wood"
      ],
      answer: "A",
      correct_option: "Glass or plastic",
      difficulty: "easy",
      global_id: 59,
      explanation: "High-purity silica glass (SiO₂) or transparent polymers (PMMA) are standard optical fibre materials."
    },
    {
      id: 10,
      question: "A single-mode fibre has:",
      options: [
        "A very small core and mainly one propagation mode",
        "A very large metal core",
        "No cladding",
        "Only electrical current"
      ],
      answer: "A",
      correct_option: "A very small core and mainly one propagation mode",
      difficulty: "easy",
      global_id: 60,
      explanation: "Single-mode fibres (core diameter ~8-10 µm) guide only the fundamental optical mode, eliminating modal dispersion."
    },
    {
      id: 11,
      question: "Multimode fibre generally has:",
      options: [
        "A larger core",
        "No core",
        "Only one photon",
        "No cladding"
      ],
      answer: "A",
      correct_option: "A larger core",
      difficulty: "easy",
      global_id: 61,
      explanation: "Multimode fibres typically have larger core diameters (50 µm to 62.5 µm), allowing multiple ray propagation paths."
    },
    {
      id: 12,
      question: "Numerical aperture indicates the fibre's:",
      options: [
        "Light-gathering ability",
        "Mass",
        "Length only",
        "Electrical resistance only"
      ],
      answer: "A",
      correct_option: "Light-gathering ability",
      difficulty: "easy",
      global_id: 62,
      explanation: "NA = sin(θmax) characterizes the range of launch angles from which the fibre can accept and guide light."
    },
    {
      id: 13,
      question: "Acceptance angle is related to:",
      options: [
        "Maximum angle for light to enter and remain guided",
        "Fibre mass",
        "Core temperature",
        "Electrical power"
      ],
      answer: "A",
      correct_option: "Maximum angle for light to enter and remain guided",
      difficulty: "easy",
      global_id: 63,
      explanation: "Acceptance angle θmax is the maximum semi-angle of the incident light cone that undergoes TIR at core-cladding boundary."
    },
    {
      id: 14,
      question: "The critical angle depends on:",
      options: [
        "Refractive indices of the two media",
        "Mass only",
        "Colour name only",
        "Fibre length only"
      ],
      answer: "A",
      correct_option: "Refractive indices of the two media",
      difficulty: "easy",
      global_id: 64,
      explanation: "The critical angle is determined by sin(θc) = n₂ / n₁."
    },
    {
      id: 15,
      question: "The outer protective layer of a fibre is generally called:",
      options: [
        "Jacket/coating",
        "Core",
        "Cladding index",
        "Lens"
      ],
      answer: "A",
      correct_option: "Jacket/coating",
      difficulty: "easy",
      global_id: 65,
      explanation: "The buffer coating and outer polymer jacket protect the fragile glass core/cladding against moisture and mechanical stress."
    },
    {
      id: 16,
      question: "In an optical fibre, light is guided mainly through the:",
      options: [
        "Core",
        "Jacket",
        "Air outside",
        "Connector pin"
      ],
      answer: "A",
      correct_option: "Core",
      difficulty: "easy",
      global_id: 66,
      explanation: "The high refractive index core traps and propagates the optical wave."
    },
    {
      id: 17,
      question: "Optical fibre communication offers:",
      options: [
        "High bandwidth",
        "Very low bandwidth only",
        "No data transmission",
        "Only audio transmission"
      ],
      answer: "A",
      correct_option: "High bandwidth",
      difficulty: "easy",
      global_id: 67,
      explanation: "Optical frequencies (~hundreds of Terahertz) support gigabits-to-terabits per second data transmission bandwidth."
    },
    {
      id: 18,
      question: "Optical fibres are immune to ordinary:",
      options: [
        "Electromagnetic interference",
        "Gravity",
        "Light",
        "All temperature effects"
      ],
      answer: "A",
      correct_option: "Electromagnetic interference",
      difficulty: "easy",
      global_id: 68,
      explanation: "Dielectric glass fibres do not conduct electrical current, making them completely immune to EMI and radio noise."
    },
    {
      id: 19,
      question: "A ray travelling exactly along the normal at a boundary has angle of incidence:",
      "options": [
        "0°",
        "45°",
        "90°",
        "180°"
      ],
      answer: "A",
      correct_option: "0°",
      difficulty: "easy",
      global_id: 69,
      explanation: "Angle of incidence is measured relative to the normal; normal incidence means θ = 0°."
    },
    {
      id: 20,
      question: "The unit commonly used for refractive index is:",
      "options": [
        "No unit",
        "Metre",
        "Newton",
        "Watt"
      ],
      answer: "A",
      correct_option: "No unit",
      difficulty: "easy",
      global_id: 70,
      explanation: "Refractive index n = c/v is a dimensionless ratio of two velocities."
    },
    {
      id: 21,
      question: "Snell's law relates:",
      "options": [
        "Angles and refractive indices",
        "Mass and force",
        "Power and time",
        "Charge and current only"
      ],
      "answer": "A",
      correct_option: "Angles and refractive indices",
      difficulty: "medium",
      global_id: 71,
      explanation: "Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂)."
    },
    {
      id: 22,
      question: "For an optical fibre with core index n1 and cladding index n2, guidance requires:",
      "options": [
        "n1 > n2",
        "n1 < n2",
        "n1 = 0",
        "n2 = 0 always"
      ],
      answer: "A",
      correct_option: "n1 > n2",
      difficulty: "medium",
      global_id: 72,
      explanation: "Core must be optically denser than cladding to support TIR."
    },
    {
      id: 23,
      question: "Critical angle C at a core-cladding boundary satisfies:",
      "options": [
        "sin C = n2/n1",
        "sin C = n1/n2",
        "C = n1+n2",
        "C = n1n2"
      ],
      "answer": "A",
      "correct_option": "sin C = n2/n1",
      difficulty: "medium",
      global_id: 73,
      explanation: "Setting refracted angle θ₂ = 90° in Snell's law gives n₁ sin(C) = n₂ sin(90°) => sin(C) = n₂/n₁."
    },
    {
      id: 24,
      question: "For air outside a fibre, numerical aperture is commonly given by:",
      "options": [
        "NA = √(n1² − n2²)",
        "NA = n1+n2",
        "NA = n1/n2",
        "NA = n1n2"
      ],
      "answer": "A",
      "correct_option": "NA = √(n1² − n2²)",
      difficulty: "medium",
      global_id: 74,
      explanation: "NA = n₀ sin(θmax) = √(n₁² - n₂²) when launching from air (n₀ = 1.0)."
    },
    {
      id: 25,
      question: "Acceptance angle increases when NA:",
      "options": [
        "Increases",
        "Decreases",
        "Becomes zero",
        "Is unrelated"
      ],
      "answer": "A",
      "correct_option": "Increases",
      difficulty: "medium",
      global_id: 75,
      explanation: "θmax = arcsin(NA); higher NA directly widens the acceptance cone angle."
    },
    {
      id: 26,
      question: "If n1 = n2, the ideal numerical aperture is:",
      "options": [
        "Zero",
        "One",
        "n1+n2",
        "Infinite"
      ],
      "answer": "A",
      "correct_option": "Zero",
      difficulty: "medium",
      "global_id": 76,
      explanation: "NA = √(n₁² - n₂²) = √(n₁² - n₁²) = 0; no refractive index contrast means zero light-guiding capability."
    },
    {
      id: 27,
      question: "Why does cladding have a lower refractive index than the core?",
      "options": [
        "To enable total internal reflection at the interface",
        "To absorb all light",
        "To stop all transmission",
        "To generate photons"
      ],
      "answer": "A",
      "correct_option": "To enable total internal reflection at the interface",
      difficulty: "medium",
      "global_id": 77,
      explanation: "Without a lower-index cladding, light would refract and leak out into surroundings."
    },
    {
      id: 28,
      question: "Which fibre is generally preferred for very long-distance, high-bandwidth links?",
      "options": [
        "Single-mode fibre",
        "Multimode step-index only",
        "Metal wire",
        "Plastic tube"
      ],
      "answer": "A",
      "correct_option": "Single-mode fibre",
      difficulty: "medium",
      "global_id": 78,
      explanation: "Single-mode fibres provide extremely low attenuation and zero intermodal pulse dispersion over hundreds of kilometers."
    },
    {
      id: 29,
      question: "Step-index fibre means the refractive index of the core:",
      "options": [
        "Is approximately constant and changes abruptly at the cladding",
        "Changes smoothly throughout the core",
        "Is always zero",
        "Equals air everywhere"
      ],
      "answer": "A",
      "correct_option": "Is approximately constant and changes abruptly at the cladding",
      difficulty: "medium",
      "global_id": 79,
      explanation: "Step-index profile features uniform core index n₁ with a sharp step change to n₂ at the cladding boundary."
    },
    {
      id: 30,
      question: "In a graded-index multimode fibre, core refractive index:",
      "options": [
        "Gradually decreases away from the centre",
        "Is constant everywhere",
        "Is zero at the centre",
        "Changes only at the jacket"
      ],
      "answer": "A",
      "correct_option": "Gradually decreases away from the centre",
      difficulty: "medium",
      "global_id": 80,
      explanation: "Parabolic grading curves outer rays back towards the axis, equalizing travel times across modes."
    },
    {
      id: 31,
      question: "Modal dispersion is especially associated with:",
      "options": [
        "Multimode propagation",
        "Single-mode propagation only",
        "No optical propagation",
        "Electrical wires only"
      ],
      "answer": "A",
      "correct_option": "Multimode propagation",
      difficulty: "medium",
      "global_id": 81,
      explanation: "Different modes take paths of different geometric lengths, spreading the optical pulse."
    },
    {
      id: 32,
      question: "Attenuation in fibre refers to:",
      "options": [
        "Loss of optical power during propagation",
        "Increase in optical power",
        "Change in fibre mass",
        "Increase in wavelength only"
      ],
      "answer": "A",
      "correct_option": "Loss of optical power during propagation",
      difficulty: "medium",
      "global_id": 82,
      explanation: "Attenuation (measured in dB/km) is signal power decay as photons travel through the fibre."
    },
    {
      id: 33,
      question: "One important cause of attenuation is:",
      "options": [
        "Absorption and scattering",
        "Gravity",
        "Magnetism only",
        "Sound"
      ],
      "answer": "A",
      "correct_option": "Absorption and scattering",
      difficulty: "medium",
      "global_id": 83,
      explanation: "Rayleigh scattering (from density fluctuations) and material absorption are primary intrinsic losses."
    },
    {
      id: 34,
      question: "A connector in an optical system is used mainly to:",
      "options": [
        "Couple light between fibre/device interfaces",
        "Increase gravity",
        "Generate electricity",
        "Change glass into metal"
      ],
      "answer": "A",
      "correct_option": "Couple light between fibre/device interfaces",
      difficulty: "medium",
      "global_id": 84,
      explanation: "Optical connectors provide low-loss, repeatable optical alignment between fibres and transmitter/receiver ports."
    },
    {
      id: 35,
      question: "If the refractive index of the core increases while cladding index stays fixed, NA generally:",
      "options": [
        "Increases",
        "Decreases to zero",
        "Stays exactly zero",
        "Becomes negative"
      ],
      "answer": "A",
      "correct_option": "Increases",
      difficulty: "medium",
      "global_id": 85,
      explanation: "NA = √(n₁² - n₂²); increasing n₁ increases the radical value, raising NA."
    },
    {
      id: 36,
      question: "For TIR, the refracted ray at the boundary:",
      "options": [
        "Does not enter the second medium as a propagating ray",
        "Has maximum intensity outside",
        "Always travels backward through air",
        "Becomes a sound wave"
      ],
      "answer": "A",
      "correct_option": "Does not enter the second medium as a propagating ray",
      difficulty: "medium",
      "global_id": 86,
      explanation: "No propagating wave carries energy into the rarer medium (only a non-propagating evanescent field exists)."
    },
    {
      id: 37,
      question: "The acceptance cone represents:",
      "options": [
        "The range of input directions accepted by the fibre",
        "The fibre's temperature range",
        "The output power only",
        "The cable diameter only"
      ],
      "answer": "A",
      "correct_option": "The range of input directions accepted by the fibre",
      difficulty: "medium",
      "global_id": 87,
      explanation: "It is the 3D cone formed by rotating the maximum acceptance angle θmax about the core axis."
    },
    {
      id: 38,
      question: "Why is optical fibre useful in medical endoscopy?",
      "options": [
        "It can transmit light/images through a flexible path",
        "It produces X-rays",
        "It measures mass directly",
        "It blocks all visible light"
      ],
      "answer": "A",
      "correct_option": "It can transmit light/images through a flexible path",
      difficulty: "medium",
      "global_id": 88,
      explanation: "Coherent fibre bundles allow illumination and visual inspection inside internal organs non-invasively."
    },
    {
      id: 39,
      question: "Compared with copper communication cables, fibre generally has:",
      "options": [
        "Lower transmission loss over suitable long links and higher bandwidth",
        "Much lower bandwidth",
        "Higher electromagnetic interference",
        "No communication capability"
      ],
      "answer": "A",
      "correct_option": "Lower transmission loss over suitable long links and higher bandwidth",
      difficulty: "medium",
      "global_id": 89,
      explanation: "Optical attenuation (~0.2 dB/km at 1550 nm) is orders of magnitude lower than electrical cable attenuation."
    },
    {
      id: 40,
      question: "A fibre's V-number (normalized frequency) depends on:",
      "options": [
        "Core/cladding indices, core radius and wavelength",
        "Mass only",
        "Cable colour only",
        "Room pressure only"
      ],
      "answer": "A",
      "correct_option": "Core/cladding indices, core radius and wavelength",
      difficulty: "medium",
      "global_id": 90,
      explanation: "V = (2π a / λ) √(n₁² - n₂²) = (2π a / λ) NA."
    },
    {
      id: 41,
      question: "If n1 = 1.50 and n2 = 1.48, the NA in air is approximately:",
      "options": [
        "0.244",
        "0.020",
        "1.49",
        "2.98"
      ],
      "answer": "A",
      "correct_option": "0.244",
      difficulty: "hard",
      "global_id": 91,
      explanation: "NA = √(1.50² - 1.48²) = √(2.25 - 2.1904) = √0.0596 ≈ 0.2441."
    },
    {
      id: 42,
      question: "For n1 = 1.5 and n2 = 1.0, the critical angle is approximately:",
      "options": [
        "41.8°",
        "30°",
        "60°",
        "90°"
      ],
      "answer": "A",
      "correct_option": "41.8°",
      difficulty: "hard",
      "global_id": 92,
      explanation: "sin(θc) = 1.0 / 1.5 = 0.6667 => θc = arcsin(0.6667) ≈ 41.81°."
    },
    {
      id: 43,
      question: "If NA = 0.5 in air, the acceptance half-angle is approximately:",
      "options": [
        "30°",
        "15°",
        "45°",
        "60°"
      ],
      "answer": "A",
      "correct_option": "30°",
      difficulty: "hard",
      "global_id": 93,
      explanation: "sin(θmax) = NA = 0.5 => θmax = arcsin(0.5) = 30°."
    },
    {
      id: 44,
      question: "If the fibre core radius is increased while other parameters remain fixed, the normalized frequency V:",
      "options": [
        "Increases",
        "Decreases",
        "Becomes zero",
        "Does not depend on radius"
      ],
      "answer": "A",
      "correct_option": "Increases",
      difficulty: "hard",
      "global_id": 94,
      explanation: "V = (2π a / λ) NA is directly proportional to core radius a."
    },
    {
      id: 45,
      question: "A fibre has n1 = 1.50 and n2 = 1.47. Its NA is closest to:",
      "options": [
        "0.30",
        "0.03",
        "1.485",
        "2.97"
      ],
      "answer": "A",
      "correct_option": "0.30",
      difficulty: "hard",
      "global_id": 95,
      explanation: "NA = √(1.50² - 1.47²) = √(2.25 - 2.1609) = √0.0891 ≈ 0.2985 ≈ 0.30."
    },
    {
      id: 46,
      question: "Why does single-mode fibre reduce modal dispersion?",
      "options": [
        "Only one mode is primarily guided",
        "It has no cladding",
        "It uses electrical current",
        "It has no refractive index difference"
      ],
      "answer": "A",
      "correct_option": "Only one mode is primarily guided",
      difficulty: "hard",
      "global_id": 96,
      explanation: "With only one spatial mode allowed (V < 2.405), there are no multiple ray paths to delay one another."
    },
    {
      id: 47,
      question: "If the wavelength increases while fibre radius and indices remain fixed, normalized frequency V:",
      "options": [
        "Decreases",
        "Increases",
        "Stays exactly same",
        "Becomes infinite"
      ],
      "answer": "A",
      "correct_option": "Decreases",
      difficulty: "hard",
      "global_id": 97,
      explanation: "V ∝ 1/λ; longer wavelengths produce lower V numbers."
    },
    {
      id: 48,
      question: "For a fibre with greater NA, the acceptance cone is generally:",
      "options": [
        "Wider",
        "Narrower",
        "Absent",
        "Always 0°"
      ],
      "answer": "A",
      "correct_option": "Wider",
      difficulty: "hard",
      "global_id": 98,
      explanation: "Higher NA means larger sin(θmax), opening a broader angular cone of accepted light."
    },
    {
      id: 49,
      question: "If core-cladding index difference is reduced significantly, TIR guidance generally becomes:",
      "options": [
        "Less strongly confined and NA decreases",
        "Stronger with larger NA",
        "Independent of indices",
        "Impossible only because wavelength changes"
      ],
      "answer": "A",
      "correct_option": "Less strongly confined and NA decreases",
      difficulty: "hard",
      "global_id": 99,
      explanation: "Lower index contrast Δ = (n₁ - n₂)/n₁ reduces the numerical aperture and makes the mode field more prone to bending loss."
    },
    {
      id: 50,
      question: "Which change most directly reduces coupling errors at a fibre input?",
      "options": [
        "Accurate alignment of the source with the acceptance cone",
        "Increasing cable weight",
        "Changing the jacket colour",
        "Heating the connector"
      ],
      "answer": "A",
      "correct_option": "Accurate alignment of the source with the acceptance cone",
      difficulty: "hard",
      "global_id": 100,
      explanation: "Matching the source emission angle to the fibre's acceptance angle minimizes geometric insertion loss."
    }
  ]
};

export const COLOUR_SENSOR_QUESTION_BANK = {
  title: "Study of Colour Sensor - Question Bank",
  experimentId: "colour-sensor",
  quizId: "colour-sensor-mastery-quiz",
  experimentName: "Study of Colour Sensor (TCS3200)",
  total_questions: 50,
  questions: [
    {
      id: 1,
      question: "What is the main purpose of a colour sensor?",
      options: [
        "Detect colours/light characteristics",
        "Measure temperature",
        "Measure pressure",
        "Measure mass"
      ],
      answer: "A",
      correct_option: "Detect colours/light characteristics",
      difficulty: "easy",
      global_id: 101,
      explanation: "Colour sensors quantify spectral reflectance/emission across RGB wavelengths to classify target chromaticity."
    },
    {
      id: 2,
      question: "RGB stands for:",
      options: [
        "Red, Green, Blue",
        "Red, Grey, Black",
        "Radiation, Green, Brightness",
        "Range, Gain, Band"
      ],
      answer: "A",
      correct_option: "Red, Green, Blue",
      difficulty: "easy",
      global_id: 102,
      explanation: "RGB represents the additive primary color channels in optoelectronics and trichromatic vision."
    },
    {
      id: 3,
      question: "Which component is commonly used to detect light?",
      options: [
        "Photodiode",
        "Fuse",
        "Switch",
        "Transformer"
      ],
      answer: "A",
      correct_option: "Photodiode",
      difficulty: "easy",
      global_id: 103,
      explanation: "Photodiodes generate current proportional to the flux of incident photons on their p-n junction."
    },
    {
      id: 4,
      question: "Which RGB colour has the longest wavelength?",
      options: [
        "Red",
        "Green",
        "Blue",
        "All are equal"
      ],
      answer: "A",
      correct_option: "Red",
      difficulty: "easy",
      global_id: 104,
      explanation: "Red light occupies the long-wavelength end of the visible spectrum (~620–750 nm)."
    },
    {
      id: 5,
      question: "Which RGB colour has the shortest wavelength?",
      options: [
        "Blue",
        "Red",
        "Green",
        "All are equal"
      ],
      answer: "A",
      correct_option: "Blue",
      difficulty: "easy",
      global_id: 105,
      explanation: "Blue/violet light has the shortest wavelength in visible spectrum (~400–495 nm)."
    },
    {
      id: 6,
      question: "If a surface reflects mostly red light, it generally appears:",
      options: [
        "Red",
        "Blue",
        "Green",
        "Black"
      ],
      answer: "A",
      correct_option: "Red",
      difficulty: "easy",
      global_id: 106,
      explanation: "An object's apparent color is determined by the spectral bands it reflects into the detector."
    },
    {
      id: 7,
      question: "Visible light is a part of:",
      options: [
        "Electromagnetic radiation",
        "Sound radiation",
        "Mechanical radiation",
        "Nuclear radiation only"
      ],
      answer: "A",
      correct_option: "Electromagnetic radiation",
      difficulty: "easy",
      global_id: 107,
      explanation: "Visible light consists of electromagnetic waves in the frequency range ~430–750 THz."
    },
    {
      id: 8,
      question: "The approximate visible-light wavelength range is:",
      options: [
        "400–700 nm",
        "1–10 nm",
        "10–100 m",
        "1–10 km"
      ],
      answer: "A",
      correct_option: "400–700 nm",
      difficulty: "easy",
      global_id: 108,
      explanation: "Human and sensor visible spectral sensitivity spans roughly 380/400 nm (violet) to 700/750 nm (deep red)."
    },
    {
      id: 9,
      question: "A photodiode converts incident light into an:",
      options: [
        "Electrical signal",
        "Sound wave",
        "Mechanical force",
        "Chemical fuel"
      ],
      answer: "A",
      correct_option: "Electrical signal",
      difficulty: "easy",
      global_id: 109,
      explanation: "The photoelectric effect creates electron-hole pairs, producing a measurable photocurrent or voltage."
    },
    {
      id: 10,
      question: "Equal high RGB intensities ideally produce:",
      options: [
        "White",
        "Black",
        "Red",
        "Magenta"
      ],
      answer: "A",
      correct_option: "White",
      difficulty: "easy",
      global_id: 110,
      explanation: "Additive mixing of full-intensity Red, Green, and Blue produces White light."
    },
    {
      id: 11,
      question: "Very low RGB intensities correspond approximately to:",
      options: [
        "Black",
        "White",
        "Yellow",
        "Cyan"
      ],
      answer: "A",
      correct_option: "Black",
      difficulty: "easy",
      global_id: 111,
      explanation: "The absence of reflected or emitted light (R=G=B≈0) corresponds to Black."
    },
    {
      id: 12,
      question: "Red plus green light produces:",
      options: [
        "Yellow",
        "Cyan",
        "Magenta",
        "Blue"
      ],
      answer: "A",
      correct_option: "Yellow",
      difficulty: "easy",
      global_id: 112,
      explanation: "In additive color synthesis, Red + Green = Yellow."
    },
    {
      id: 13,
      question: "Green plus blue light produces:",
      options: [
        "Cyan",
        "Yellow",
        "Red",
        "Orange"
      ],
      answer: "A",
      correct_option: "Cyan",
      difficulty: "easy",
      global_id: 113,
      explanation: "In additive color synthesis, Green + Blue = Cyan."
    },
    {
      id: 14,
      question: "Red plus blue light produces:",
      options: [
        "Magenta",
        "Green",
        "Cyan",
        "Yellow"
      ],
      answer: "A",
      correct_option: "Magenta",
      difficulty: "easy",
      global_id: 114,
      explanation: "In additive color synthesis, Red + Blue = Magenta."
    },
    {
      id: 15,
      question: "The unit nm commonly represents:",
      options: [
        "Wavelength",
        "Mass",
        "Pressure",
        "Current"
      ],
      answer: "A",
      correct_option: "Wavelength",
      difficulty: "easy",
      global_id: 115,
      explanation: "1 nanometer (nm) = 10⁻⁹ meters, standard for optical wavelengths."
    },
    {
      id: 16,
      question: "A sensor is a device that:",
      options: [
        "Detects a physical quantity and produces a usable signal",
        "Stores energy only",
        "Displays images only",
        "Acts only as a battery"
      ],
      answer: "A",
      correct_option: "Detects a physical quantity and produces a usable signal",
      difficulty: "easy",
      global_id: 116,
      explanation: "Transducers/sensors convert physical stimuli into readable electrical responses."
    },
    {
      id: 17,
      question: "A colour sensor mainly detects:",
      options: [
        "Light",
        "Sound",
        "Pressure",
        "Mass"
      ],
      answer: "A",
      correct_option: "Light",
      difficulty: "easy",
      global_id: 117,
      explanation: "Colour sensors measure electromagnetic radiation in the visible band."
    },
    {
      id: 18,
      question: "If a surface absorbs most visible light, it appears:",
      options: [
        "Dark",
        "White",
        "Transparent",
        "Bright yellow always"
      ],
      answer: "A",
      correct_option: "Dark",
      difficulty: "easy",
      global_id: 118,
      explanation: "High absorption with minimal reflection reflects almost no photons back to the sensor."
    },
    {
      id: 19,
      question: "Which region is normally detected by a visible colour sensor?",
      options: [
        "Visible spectrum",
        "X-ray",
        "Gamma-ray",
        "Radio"
      ],
      answer: "A",
      correct_option: "Visible spectrum",
      difficulty: "easy",
      global_id: 119,
      explanation: "Visible sensors have optical filters calibrated for human visual bandwidths (400–700 nm)."
    },
    {
      id: 20,
      question: "The three common colour channels in an RGB sensor are:",
      options: [
        "R, G and B",
        "X, Y and Z only",
        "A, B and C only",
        "P, Q and R only"
      ],
      answer: "A",
      correct_option: "R, G and B",
      difficulty: "easy",
      global_id: 120,
      explanation: "TCS3200 uses an 8x8 array of photodiodes partitioned with Red, Green, Blue, and Clear filters."
    },
    {
      id: 21,
      question: "Why are multiple RGB channels useful?",
      options: [
        "They allow different spectral components to be compared",
        "They measure pressure",
        "They remove all light",
        "They increase object mass"
      ],
      answer: "A",
      correct_option: "They allow different spectral components to be compared",
      difficulty: "medium",
      "global_id": 121,
      explanation: "Comparing relative filter responses lets the system differentiate hue and saturation independently of light intensity."
    },
    {
      id: 22,
      question: "If the red-channel reading is much higher than green and blue, the target has a strong:",
      "options": [
        "Red component",
        "Green component",
        "Blue component",
        "Cyan component"
      ],
      "answer": "A",
      "correct_option": "Red component",
      difficulty: "medium",
      global_id: 122,
      explanation: "High red filter transmittance indicates abundant photons in the ~650 nm wavelength region."
    },
    {
      id: 23,
      question: "What is the role of an ADC?",
      "options": [
        "Convert an analog signal into digital values",
        "Produce visible light",
        "Measure mass",
        "Store mechanical energy"
      ],
      "answer": "A",
      "correct_option": "Convert an analog signal into digital values",
      difficulty: "medium",
      global_id: 123,
      explanation: "Analog-to-Digital Converters (ADCs) quantize continuous photocurrent voltages into discrete digital numbers."
    },
    {
      id: 24,
      question: "Why is calibration important for a colour sensor?",
      "options": [
        "It improves accuracy and accounts for system variations",
        "It changes the object's mass",
        "It removes all light",
        "It makes wavelength constant"
      ],
      "answer": "A",
      "correct_option": "It improves accuracy and accounts for system variations",
      difficulty: "medium",
      global_id: 124,
      explanation: "Calibration normalizes for ambient lighting, LED color temperature, detector responsivity offsets, and distance."
    },
    {
      id: 25,
      question: "Why can the same object give different readings under different light sources?",
      "options": [
        "Illumination spectrum and intensity can change",
        "Its mass changes automatically",
        "Gravity changes its colour",
        "The sensor becomes a thermometer"
      ],
      "answer": "A",
      "correct_option": "Illumination spectrum and intensity can change",
      difficulty: "medium",
      global_id: 125,
      explanation: "Reflected spectrum = Incident spectrum × Reflectance curve. If the source spectrum changes (e.g. tungsten vs sunlight), reflected light changes."
    },
    {
      id: 26,
      question: "Why should sensor-to-target distance often be kept constant?",
      "options": [
        "To keep measurement conditions consistent",
        "To increase wavelength",
        "To change the target colour",
        "To increase gravity"
      ],
      "answer": "A",
      "correct_option": "To keep measurement conditions consistent",
      difficulty: "medium",
      global_id: 126,
      explanation: "Light intensity obeys the inverse-square law; varying distance shifts signal amplitudes."
    },
    {
      id: 27,
      question: "What is spectral response?",
      "options": [
        "Variation of sensor output with wavelength",
        "Variation of mass with time",
        "Variation of pressure with height",
        "Variation of resistance with length only"
      ],
      "answer": "A",
      "correct_option": "Variation of sensor output with wavelength",
      difficulty: "medium",
      global_id: 127,
      explanation: "Spectral responsivity R(λ) defines the output current per watt of incident optical power as a function of wavelength."
    },
    {
      id: 28,
      question: "Which is most directly related to colour rather than just brightness?",
      "options": [
        "Relative RGB values",
        "Battery weight",
        "Screw size",
        "Room temperature alone"
      ],
      "answer": "A",
      "correct_option": "Relative RGB values",
      difficulty: "medium",
      global_id: 128,
      explanation: "Ratios r = R/(R+G+B) isolate chromaticity (hue/saturation) from luminance."
    },
    {
      id: 29,
      question: "If all RGB readings rise by roughly the same proportion, what likely changed?",
      "options": [
        "Overall illumination intensity",
        "Hue only",
        "Object mass",
        "Wavelength of every photon necessarily"
      ],
      "answer": "A",
      "correct_option": "Overall illumination intensity",
      difficulty: "medium",
      global_id: 129,
      explanation: "Scaling all color channels uniformly indicates a change in light source brightness or distance, not color."
    },
    {
      id: 30,
      question: "What is the purpose of a white reference surface?",
      "options": [
        "Provide a known response for comparison/calibration",
        "Block all light",
        "Generate a laser",
        "Absorb all wavelengths"
      ],
      "answer": "A",
      "correct_option": "Provide a known response for comparison/calibration",
      difficulty: "medium",
      global_id: 130,
      explanation: "A high-reflectance white standard (like barium sulfate or PTFE) provides full-spectrum reference calibration."
    },
    {
      id: 31,
      question: "Why can ambient light affect a colour sensor?",
      "options": [
        "It adds unwanted light to the measured signal",
        "It changes gravity",
        "It changes object mass",
        "It stops the sensor from detecting red"
      ],
      "answer": "A",
      "correct_option": "It adds unwanted light to the measured signal",
      difficulty: "medium",
      global_id: 131,
      explanation: "Stray background photons combine with the target reflection, skewing RGB proportions."
    },
    {
      id: 32,
      question: "What does wavelength describe?",
      "options": [
        "Distance between corresponding points of a wave",
        "Photon mass",
        "Brightness only",
        "Electrical resistance"
      ],
      "answer": "A",
      "correct_option": "Distance between corresponding points of a wave",
      difficulty: "medium",
      global_id: 132,
      explanation: "Wavelength λ is the spatial period of the optical wave crest-to-crest."
    },
    {
      id: 33,
      question: "Photon energy is related to frequency by:",
      "options": [
        "E = hf",
        "E = h/f",
        "E = f/h",
        "E = h+f"
      ],
      "answer": "A",
      "correct_option": "E = hf",
      difficulty: "medium",
      global_id: 133,
      explanation: "Planck-Einstein relation: E = hf = hc/λ, where h is Planck's constant."
    },
    {
      id: 34,
      question: "For electromagnetic radiation in vacuum:",
      "options": [
        "c = fλ",
        "c = f/λ",
        "c = λ/f",
        "c = f+λ"
      ],
      "answer": "A",
      "correct_option": "c = fλ",
      difficulty: "medium",
      global_id: 134,
      explanation: "The wave speed equals frequency times wavelength: c = fλ ≈ 3 × 10⁸ m/s."
    },
    {
      id: 35,
      question: "If wavelength increases in vacuum, frequency:",
      "options": [
        "Decreases",
        "Increases",
        "Becomes zero",
        "Always stays the same"
      ],
      "answer": "A",
      "correct_option": "Decreases",
      difficulty: "medium",
      global_id: 135,
      explanation: "Because c = fλ is constant, frequency is inversely proportional to wavelength (f = c/λ)."
    },
    {
      id: 36,
      question: "Which condition improves repeatability of colour measurements?",
      "options": [
        "Controlled illumination",
        "Changing sensor distance each time",
        "Changing the target angle randomly",
        "Ignoring calibration"
      ],
      "answer": "A",
      "correct_option": "Controlled illumination",
      difficulty: "medium",
      global_id: 136,
      explanation: "Consistent lighting and fixed sensor geometry guarantee reproducible spectral measurements."
    },
    {
      id: 37,
      question: "RGB values can be normalized mainly to reduce the effect of:",
      "options": [
        "Overall brightness variation",
        "Object mass",
        "Gravity",
        "Room size"
      ],
      "answer": "A",
      "correct_option": "Overall brightness variation",
      difficulty: "medium",
      global_id: 137,
      explanation: "Normalization converts raw values into chromaticity coordinates r, g, b where r + g + b = 1."
    },
    {
      id: 38,
      question: "A matte surface is often easier to measure consistently because it:",
      "options": [
        "Reduces strong specular reflections",
        "Emits its own light",
        "Absorbs all colours",
        "Has infinite reflectivity"
      ],
      "answer": "A",
      "correct_option": "Reduces strong specular reflections",
      difficulty: "medium",
      global_id: 138,
      explanation: "Lambertian (matte) diffusion scatters light uniformly in all directions, avoiding specular glare spikes."
    },
    {
      id: 39,
      question: "A colour sensor's output is most directly related to:",
      "options": [
        "Light reaching its photodetectors",
        "Object weight",
        "Sound reaching the sensor",
        "Air pressure only"
      ],
      "answer": "A",
      "correct_option": "Light reaching its photodetectors",
      difficulty: "medium",
      global_id: 139,
      explanation: "The electrical output directly corresponds to the radiant flux captured by the filtered photodiode array."
    },
    {
      id: 40,
      question: "Under additive colour mixing, equal red and green with little blue appears approximately:",
      "options": [
        "Yellow",
        "Cyan",
        "Magenta",
        "Blue"
      ],
      "answer": "A",
      "correct_option": "Yellow",
      difficulty: "medium",
      global_id: 140,
      explanation: "Combining Red and Green spectral emissions stimulates red and green cone photoreceptors, perceived as Yellow."
    },
    {
      id: 41,
      question: "A sensor gives R=200,G=50,B=40 and another gives R=100,G=25,B=20 under identical conditions. Best conclusion:",
      "options": [
        "Their relative colour composition is similar but the second signal is weaker",
        "The second must be blue",
        "The first must be white",
        "They necessarily have different hues"
      ],
      "answer": "A",
      "correct_option": "Their relative colour composition is similar but the second signal is weaker",
      difficulty: "hard",
      "global_id": 141,
      explanation: "Both maintain a 4:1:0.8 channel ratio, meaning the hue is identical while luminance differs."
    },
    {
      id: 42,
      question: "Why are RGB values not exact wavelength measurements?",
      "options": [
        "Each channel usually responds over a range of wavelengths",
        "Each channel detects one exact wavelength",
        "RGB sensors detect mass",
        "Wavelength is unrelated to light"
      ],
      "answer": "A",
      "correct_option": "Each channel usually responds over a range of wavelengths",
      difficulty: "hard",
      "global_id": 142,
      explanation: "Broadband optical filters integrate photon flux over wide transmission passbands (~50–100 nm FWHM)."
    },
    {
      id: 43,
      question: "If the same spectrum is made twice as bright, what should ideally remain similar for colour estimation?",
      "options": [
        "Normalized RGB ratios",
        "Raw RGB values",
        "Sensor distance automatically",
        "Object mass"
      ],
      "answer": "A",
      "correct_option": "Normalized RGB ratios",
      difficulty: "hard",
      "global_id": 143,
      explanation: "Scaling intensity doubles numerator and denominator, leaving ratios R/(R+G+B) invariant."
    },
    {
      id: 44,
      question: "Why is ambient-light shielding useful?",
      "options": [
        "It reduces unwanted light added to the measured signal",
        "It changes red into blue",
        "It increases object reflectivity",
        "It removes the need for calibration in every system"
      ],
      "answer": "A",
      "correct_option": "It reduces unwanted light added to the measured signal",
      difficulty: "hard",
      "global_id": 144,
      explanation: "Optical hoods prevent room fluorescent/daylight flicker from contaminating the reflected LED signal."
    },
    {
      id: 45,
      question: "If RGB spectral responses overlap, then:",
      "options": [
        "One wavelength range can contribute to multiple channels",
        "Each channel detects exactly one wavelength",
        "No colour can be detected",
        "Only brightness can be measured"
      ],
      "answer": "A",
      "correct_option": "One wavelength range can contribute to multiple channels",
      difficulty: "hard",
      "global_id": 145,
      explanation: "Intermediate wavelengths (e.g. 580 nm yellow) pass partially through both Red and Green filter curves."
    },
    {
      id: 46,
      question: "Why is a white reference useful before measuring unknown colours?",
      "options": [
        "It provides a baseline for channel responses under the current illumination",
        "It blocks all visible light",
        "It generates photons",
        "It makes all objects white"
      ],
      "answer": "A",
      "correct_option": "It provides a baseline for channel responses under the current illumination",
      difficulty: "hard",
      "global_id": 146,
      explanation: "White balance calibration normalizes channel gains against the true spectral power distribution of the illuminant."
    },
    {
      id: 47,
      question: "If room lighting changes and readings become unstable, the most likely issue is:",
      "options": [
        "Uncontrolled illumination",
        "Incorrect object mass",
        "Wrong gravity",
        "Excessive cable length"
      ],
      "answer": "A",
      "correct_option": "Uncontrolled illumination",
      difficulty: "hard",
      "global_id": 147,
      explanation: "Unshielded fluctuations in ambient room lights contaminate photodiode integration."
    },
    {
      id: 48,
      question: "A dominant red-channel response primarily means:",
      "options": [
        "More red-region light is reaching the sensor relative to other channel responses",
        "The surface emits only red photons",
        "The surface absorbs no light",
        "The sensor has no green/blue sensitivity"
      ],
      "answer": "A",
      "correct_option": "More red-region light is reaching the sensor relative to other channel responses",
      difficulty: "hard",
      "global_id": 148,
      explanation: "Photocurrent from the red-filtered photodiodes exceeds that from green/blue filters."
    },
    {
      id: 49,
      question: "Best way to compare colours when overall brightness varies:",
      "options": [
        "Use calibrated or normalized channel values",
        "Compare only raw red values",
        "Ignore calibration",
        "Use object weight"
      ],
      "answer": "A",
      "correct_option": "Use calibrated or normalized channel values",
      difficulty: "hard",
      "global_id": 149,
      explanation: "Chromaticity normalization removes the scalar dependence on lux/illumination level."
    },
    {
      id: 50,
      question: "Which statement best summarizes a colour-sensor experiment?",
      "options": [
        "Relating optical response to different colours/light conditions and electrical output",
        "Measuring mass of coloured objects",
        "Studying sound reflection",
        "Measuring room temperature only"
      ],
      "answer": "A",
      "correct_option": "Relating optical response to different colours/light conditions and electrical output",
      difficulty: "hard",
      "global_id": 150,
      explanation: "The experiment studies the optoelectronic transduction of spectral reflectance into calibrated RGB frequency/voltage signals."
    }
  ]
};

export const SANDBOX_QUESTION_BANK = {
  title: "Physics Sandbox & Newtonian Mechanics - Question Bank",
  experimentId: "sandbox",
  quizId: "sandbox-mastery-quiz",
  experimentName: "Physics Sandbox (Newtonian Mechanics)",
  total_questions: 15,
  questions: [
    {
      id: 1,
      question: "State Newton's Second Law of Motion mathematically:",
      options: [
        "F = ma",
        "F = m / a",
        "F = mv",
        "F = (1/2)ma²"
      ],
      answer: "A",
      correct_option: "F = ma",
      difficulty: "easy",
      global_id: 201,
      explanation: "Newton's Second Law states that net applied force equals mass multiplied by acceleration: F = ma."
    },
    {
      id: 2,
      question: "How is average linear acceleration 'a' defined from initial velocity u, final velocity v, and elapsed time t?",
      options: [
        "a = (v − u) / t",
        "a = (v + u) / t",
        "a = (v − u) · t",
        "a = t / (v − u)"
      ],
      answer: "A",
      correct_option: "a = (v − u) / t",
      difficulty: "easy",
      global_id: 202,
      explanation: "Acceleration is the time rate of change of velocity: a = Δv / Δt = (v − u) / t."
    },
    {
      id: 3,
      question: "What formula gives the weight W of an object of mass m under local gravitational acceleration g?",
      options: [
        "W = mg",
        "W = m / g",
        "W = (1/2)mg²",
        "W = g / m"
      ],
      answer: "A",
      correct_option: "W = mg",
      difficulty: "easy",
      global_id: 203,
      explanation: "Weight is the force exerted on a mass by gravity: W = mg."
    },
    {
      id: 4,
      question: "What is the formula for frictional force Fᶠ given coefficient of friction μ and normal force N?",
      options: [
        "Fᶠ = μN",
        "Fᶠ = μ / N",
        "Fᶠ = N / μ",
        "Fᶠ = (1/2)μN²"
      ],
      answer: "A",
      correct_option: "Fᶠ = μN",
      difficulty: "easy",
      global_id: 204,
      explanation: "Frictional resistance between two surfaces is proportional to normal load: Fᶠ = μN."
    },
    {
      id: 5,
      question: "What is the formula for the kinetic energy (KE) of a body with mass m moving at velocity v?",
      options: [
        "KE = (1/2)mv²",
        "KE = mv²",
        "KE = (1/2)mv",
        "KE = 2mv²"
      ],
      answer: "A",
      correct_option: "KE = (1/2)mv²",
      difficulty: "easy",
      global_id: 205,
      explanation: "Kinetic energy of a moving mass is KE = (1/2)mv²."
    },
    {
      id: 6,
      question: "If a 2.0 kg box in the simulator experiences a net applied force of 10.0 N, what is its acceleration?",
      options: [
        "5.0 m/s²",
        "20.0 m/s²",
        "2.0 m/s²",
        "0.2 m/s²"
      ],
      answer: "A",
      correct_option: "5.0 m/s²",
      difficulty: "easy",
      global_id: 206,
      explanation: "From F = ma, acceleration a = F / m = 10.0 N / 2.0 kg = 5.0 m/s²."
    },
    {
      id: 7,
      question: "An object accelerated from rest (u = 0 m/s) reaches a speed of 20 m/s in 4.0 s. Its acceleration is:",
      options: [
        "5.0 m/s²",
        "80.0 m/s²",
        "2.5 m/s²",
        "10.0 m/s²"
      ],
      answer: "A",
      correct_option: "5.0 m/s²",
      difficulty: "medium",
      global_id: 207,
      explanation: "Using a = (v − u) / t: a = (20 − 0) / 4 = 5.0 m/s²."
    },
    {
      id: 8,
      question: "A 5.0 kg mass sits on a horizontal surface where g = 9.8 m/s². What is its gravitational weight W?",
      options: [
        "49.0 N",
        "9.8 N",
        "2.0 N",
        "50.0 N"
      ],
      answer: "A",
      correct_option: "49.0 N",
      difficulty: "easy",
      global_id: 208,
      explanation: "W = mg = 5.0 kg × 9.8 m/s² = 49.0 N."
    },
    {
      id: 9,
      question: "If normal reaction force N = 50.0 N and friction coefficient μ = 0.20, what is the maximum frictional force Fᶠ?",
      options: [
        "10.0 N",
        "250.0 N",
        "5.0 N",
        "0.004 N"
      ],
      answer: "A",
      correct_option: "10.0 N",
      difficulty: "medium",
      global_id: 209,
      explanation: "Fᶠ = μN = 0.20 × 50.0 N = 10.0 N."
    },
    {
      id: 10,
      question: "A 4.0 kg ball moves with speed 3.0 m/s. What is its kinetic energy?",
      options: [
        "18.0 J",
        "12.0 J",
        "36.0 J",
        "6.0 J"
      ],
      answer: "A",
      correct_option: "18.0 J",
      difficulty: "medium",
      global_id: 210,
      explanation: "KE = (1/2)mv² = 0.5 × 4.0 × (3.0)² = 2 × 9 = 18.0 J."
    },
    {
      id: 11,
      question: "According to Newton's Second Law, if the net external force F_net acting on an object is zero, its acceleration is:",
      options: [
        "Zero (velocity remains constant)",
        "Infinity",
        "9.8 m/s²",
        "Continuously increasing"
      ],
      answer: "A",
      correct_option: "Zero (velocity remains constant)",
      difficulty: "easy",
      global_id: 211,
      explanation: "When F_net = 0, a = F_net / m = 0, meaning velocity does not change (Newton's 1st Law)."
    },
    {
      id: 12,
      question: "What happens to the kinetic energy of an object if its speed v is doubled?",
      options: [
        "It increases by 4 times (quadruples)",
        "It doubles (increases by 2 times)",
        "It remains unchanged",
        "It increases by 8 times"
      ],
      answer: "A",
      correct_option: "It increases by 4 times (quadruples)",
      difficulty: "medium",
      global_id: 212,
      explanation: "Since KE ∝ v², doubling v multiplies KE by 2² = 4."
    },
    {
      id: 13,
      question: "If the mass of an accelerating body is doubled while the net applied force remains constant, the acceleration:",
      options: [
        "Halves (is reduced to 1/2)",
        "Doubles (is multiplied by 2)",
        "Stays constant",
        "Quadruples"
      ],
      answer: "A",
      correct_option: "Halves (is reduced to 1/2)",
      difficulty: "easy",
      global_id: 213,
      explanation: "Since a = F / m, acceleration is inversely proportional to mass."
    },
    {
      id: 14,
      question: "In the friction formula Fᶠ = μN, what does N represent physically?",
      options: [
        "The normal contact force perpendicular to the contact interface",
        "Newton's constant of universal gravitation",
        "Net horizontal driving force",
        "Number of interacting surface molecules"
      ],
      answer: "A",
      correct_option: "The normal contact force perpendicular to the contact interface",
      difficulty: "medium",
      global_id: 214,
      explanation: "N is the normal reaction force directed perpendicular to the contact surface."
    },
    {
      id: 15,
      question: "A 10.0 kg object is in free fall in zero-gravity space (g = 0 m/s²). What is its weight?",
      options: [
        "0 N (weightless)",
        "98.1 N",
        "10.0 N",
        "Infinity"
      ],
      answer: "A",
      correct_option: "0 N (weightless)",
      difficulty: "easy",
      global_id: 215,
      explanation: "W = mg = 10.0 kg × 0 m/s² = 0 N."
    }
  ]
};

export const DIFFRACTION_QUESTION_BANK = {
  title: "Diffraction Grating & Wave Optics - Question Bank",
  experimentId: "diffraction",
  quizId: "diffraction-mastery-quiz",
  experimentName: "Diffraction Grating (Wave Optics)",
  total_questions: 15,
  questions: [
    {
      id: 1,
      question: "What is the fundamental Grating Equation relating grating spacing d, angle θ, spectral order n, and wavelength λ?",
      options: [
        "d sin θ = nλ",
        "d cos θ = nλ",
        "d / sin θ = nλ",
        "d sin θ = λ / n"
      ],
      answer: "A",
      correct_option: "d sin θ = nλ",
      difficulty: "easy",
      global_id: 301,
      explanation: "The condition for constructive interference principal maxima through a transmission grating is d sin θ = nλ."
    },
    {
      id: 2,
      question: "Rearranging the grating equation, what is the formula for wavelength λ?",
      options: [
        "λ = (d sin θ) / n",
        "λ = (n sin θ) / d",
        "λ = n d sin θ",
        "λ = d / (n sin θ)"
      ],
      answer: "A",
      correct_option: "λ = (d sin θ) / n",
      difficulty: "easy",
      global_id: 302,
      explanation: "Dividing both sides of d sin θ = nλ by order n yields λ = (d sin θ) / n."
    },
    {
      id: 3,
      question: "How is the grating element d related to the number of lines per unit length N?",
      options: [
        "d = 1 / N",
        "d = N",
        "d = 10⁻³ · N",
        "d = N²"
      ],
      answer: "A",
      correct_option: "d = 1 / N",
      difficulty: "easy",
      global_id: 303,
      explanation: "The grating element (pitch d) is the reciprocal of lines per unit length: d = 1 / N."
    },
    {
      id: 4,
      question: "If N is the number of lines per millimeter, what is the grating element d in meters?",
      options: [
        "d = 10⁻³ / N",
        "d = 10³ / N",
        "d = 10⁻⁶ / N",
        "d = N / 10⁻³"
      ],
      answer: "A",
      correct_option: "d = 10⁻³ / N",
      difficulty: "medium",
      global_id: 304,
      explanation: "Since 1 mm = 10⁻³ m, d in meters is 10⁻³ / N."
    },
    {
      id: 5,
      question: "Substituting d = 10⁻³ / N into the wavelength formula λ = (d sin θ) / n gives:",
      options: [
        "λ = (10⁻³ sin θ) / (nN)",
        "λ = (nN sin θ) / 10⁻³",
        "λ = (10⁻³ n sin θ) / N",
        "λ = (N sin θ) / (10⁻³ n)"
      ],
      answer: "A",
      correct_option: "λ = (10⁻³ sin θ) / (nN)",
      difficulty: "medium",
      global_id: 305,
      explanation: "Substituting d = 10⁻³ / N into λ = (d sin θ) / n directly yields λ = (10⁻³ sin θ) / (nN)."
    },
    {
      id: 6,
      question: "What is the diffraction angle θ for the central zeroth-order maximum (n = 0)?",
      options: [
        "0° (directly on the optical axis)",
        "90°",
        "45°",
        "Depends on wavelength"
      ],
      answer: "A",
      correct_option: "0° (directly on the optical axis)",
      difficulty: "easy",
      global_id: 306,
      explanation: "When n = 0, d sin θ = 0 ⇒ sin θ = 0 ⇒ θ = 0° for all wavelengths."
    },
    {
      id: 7,
      question: "If a diffraction grating has N = 500 lines/mm, what is its grating pitch d?",
      options: [
        "2.0 × 10⁻⁶ m (2.0 μm)",
        "5.0 × 10⁻⁶ m (5.0 μm)",
        "0.5 × 10⁻³ m",
        "2.0 × 10⁻³ m"
      ],
      answer: "A",
      correct_option: "2.0 × 10⁻⁶ m (2.0 μm)",
      difficulty: "medium",
      global_id: 307,
      explanation: "d = 10⁻³ / 500 = 2.0 × 10⁻⁶ m = 2.0 μm."
    },
    {
      id: 8,
      question: "In the grating equation d sin θ = nλ, what does the integer 'n' designate?",
      options: [
        "Order number of the diffraction maximum (n = 0, ±1, ±2, ...)",
        "Refractive index of the grating glass",
        "Total number of slits in the grating",
        "Intensity of the incident beam"
      ],
      answer: "A",
      correct_option: "Order number of the diffraction maximum (n = 0, ±1, ±2, ...)",
      difficulty: "easy",
      global_id: 308,
      explanation: "n is the spectral order representing the integer number of wavelengths path difference between adjacent slits."
    },
    {
      id: 9,
      question: "For a given order n and grating d, how does the diffraction angle θ vary with wavelength λ?",
      options: [
        "Longer wavelengths diffract at larger angles θ",
        "Shorter wavelengths diffract at larger angles θ",
        "All wavelengths diffract at the exact same angle",
        "Wavelength has no effect on diffraction angle"
      ],
      answer: "A",
      correct_option: "Longer wavelengths diffract at larger angles θ",
      difficulty: "medium",
      global_id: 309,
      explanation: "From sin θ = nλ / d, sin θ is directly proportional to λ; red light (longer λ) diffracts more than blue (shorter λ)."
    },
    {
      id: 10,
      question: "If the calculated sin θ for an order n exceeds 1.0, what does this indicate physically?",
      options: [
        "That spectral order cannot form (it is physically inaccessible)",
        "The light is absorbed as heat",
        "The wave becomes supersonic",
        "The grating converts light into electricity"
      ],
      answer: "A",
      correct_option: "That spectral order cannot form (it is physically inaccessible)",
      difficulty: "medium",
      global_id: 310,
      explanation: "Since real angles have |sin θ| ≤ 1, any order requiring sin θ > 1 cannot exist physically."
    },
    {
      id: 11,
      question: "If a grating's line density N is increased (e.g. from 300 to 600 lines/mm), what happens to fringe angular spacing?",
      options: [
        "Angular separation between orders increases",
        "Angular separation between orders decreases",
        "Fringes collapse into a single point",
        "No change occurs"
      ],
      answer: "A",
      correct_option: "Angular separation between orders increases",
      difficulty: "medium",
      global_id: 311,
      explanation: "Higher N means smaller d (d = 1/N). Since sin θ = nλ/d, smaller d increases sin θ and widens fringe separation."
    },
    {
      id: 12,
      question: "On a detector screen at distance L, fringe position y for small to moderate angle θ is related to θ by:",
      options: [
        "y = L · tan θ",
        "y = L / sin θ",
        "y = L · cos θ",
        "y = L² · tan θ"
      ],
      answer: "A",
      correct_option: "y = L · tan θ",
      difficulty: "easy",
      global_id: 312,
      explanation: "From standard right-triangle geometry of the optical bench, tan θ = y / L ⇒ y = L · tan θ."
    },
    {
      id: 13,
      question: "What physical phenomenon occurs when light passes through thousands of closely spaced parallel slits?",
      options: [
        "Multi-slit Fraunhofer diffraction and coherent interference",
        "Nuclear magnetic resonance",
        "Total internal reflection inside the vacuum",
        "Piezoelectric polarization"
      ],
      answer: "A",
      correct_option: "Multi-slit Fraunhofer diffraction and coherent interference",
      difficulty: "easy",
      global_id: 313,
      explanation: "A diffraction grating produces constructive interference between diffracted wavelets from multiple coherent slits."
    },
    {
      id: 14,
      question: "What is the SI unit of wavelength λ calculated from the grating formula?",
      options: [
        "Meter (m)",
        "Diopter (D)",
        "Watt per steradian",
        "Hertz (Hz)"
      ],
      answer: "A",
      correct_option: "Meter (m)",
      difficulty: "easy",
      global_id: 314,
      explanation: "Wavelength is a spatial length measurement with SI unit meters (m), commonly expressed in nanometers (1 nm = 10⁻⁹ m)."
    },
    {
      id: 15,
      question: "Why does the central maximum (n = 0) of a white-light source through a grating appear white?",
      options: [
        "Because all wavelengths have zero path difference (θ = 0) and recombine",
        "Because gratings only diffract ultraviolet rays",
        "Because glass absorbs all colors except white",
        "Because speed of light is zero on axis"
      ],
      answer: "A",
      correct_option: "Because all wavelengths have zero path difference (θ = 0) and recombine",
      difficulty: "medium",
      global_id: 315,
      explanation: "At n = 0, path difference d sin θ = 0 for all wavelengths simultaneously, so all spectral components overlap to yield white light."
    }
  ]
};

/**
 * Fisher-Yates pure randomization shuffle algorithm
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns a fresh, randomly sampled 10-question quiz with completely shuffled questions
 * and shuffled options for every single question.
 * 
 * @param {string} expId - 'projectile' | 'optical' | 'colour-sensor' | 'sandbox' | 'diffraction'
 * @returns {object} { quizId, title, experimentName, questions: [10 randomly sampled and shuffled questions] }
 */
export function generateRandom10QuestionQuiz(expId = "projectile") {
  let bank = PROJECTILE_QUESTION_BANK;
  if (expId === "optical" || expId === "exp-optical" || expId === "exp2") {
    bank = OPTICAL_FIBRE_QUESTION_BANK;
  } else if (expId === "colour-sensor" || expId === "exp-colour-sensor" || expId === "exp3") {
    bank = COLOUR_SENSOR_QUESTION_BANK;
  } else if (expId === "sandbox" || expId === "exp-sandbox" || expId === "exp4") {
    bank = SANDBOX_QUESTION_BANK;
  } else if (expId === "diffraction" || expId === "exp-diffraction" || expId === "exp5") {
    bank = DIFFRACTION_QUESTION_BANK;
  }

  // 1. Shuffle the full 50-question bank
  const shuffled50 = shuffleArray(bank.questions);

  // 2. Select 10 random questions
  const selected10 = shuffled50.slice(0, 10);

  // 3. For each selected question, shuffle its options and dynamically compute the correct answer
  const questions = selected10.map((q, idx) => {
    // Determine the exact correct option text
    const correctText = q.correct_option || q.options[0];

    // Shuffle the options array
    const shuffledOptions = shuffleArray(q.options);

    // Find the new index and letter for the correct answer
    const correctIdx = shuffledOptions.indexOf(correctText);
    const letters = ["A", "B", "C", "D"];
    const dynamicAnswerLetter = letters[correctIdx] || "A";

    return {
      id: q.id,
      originalGlobalId: q.global_id || q.id,
      indexInQuiz: idx + 1,
      question: q.question,
      options: shuffledOptions,
      answer: correctText, // The exact correct option text
      answerLetter: dynamicAnswerLetter,
      correct_option: correctText,
      explanation: q.explanation || `Correct answer is: ${correctText}`,
      difficulty: q.difficulty || "medium"
    };
  });

  return {
    quizId: bank.quizId,
    title: bank.title,
    experimentId: bank.experimentId,
    experimentName: bank.experimentName,
    totalQuestions: questions.length,
    questions
  };
}

// Backward-compatible default export
export const QUIZ_DATA = {
  experiment: "2D Projectile Kinematics & Lab Mastery",
  description: "Dynamic 10-Question Randomized Physics Knowledge Evaluation",
  get questions() {
    return generateRandom10QuestionQuiz("projectile").questions;
  }
};
