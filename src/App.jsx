import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  EyeOff,
  Play,
  Skull,
  RotateCcw,
  Edit2,
  User,
  Tv,
  Trophy,
  Utensils,
  MapPin,
  Flame,
  Beer,
  Music,
  ShoppingBag,
  HelpCircle,
  X,
  ChevronRight,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Smartphone,
  Briefcase,
  Dog,
  Check
} from "lucide-react";

// --- SISTEMA DE AUDIO (Web Audio API) ---
const audioCtx =
  typeof window !== "undefined"
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null;

const playSound = (type) => {
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === "click") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === "flip") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === "alarm") {
    osc.type = "square";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(0, now + 0.15);
    osc.frequency.setValueAtTime(800, now + 0.3);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  } else if (type === "chaos") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.8);
  }
};

const vibrate = (pattern) => {
  if (typeof navigator !== "undefined" && navigator.vibrate)
    navigator.vibrate(pattern);
};

// --- DATOS BASE DE CATEGORÍAS ---
const DEFAULT_CATEGORIES = [
  {
    id: "tv",
    label: "Famosos",
    icon: <Tv size={18} />,
    color: "from-purple-600 to-indigo-600",
    words: [
      "Guillermo Francella", "Ricardo Darín", "Adrián Suar", "Flor Peña",
      "Moria Casán", "Susana Giménez", "Marcelo Tinelli", "Jorge Rial",
      "Mirtha Legrand", "Santiago del Moro", "China Suárez", "Wanda Nara",
      "Lali Espósito", "Pepe Argento", "Yanina Latorre", "Pampita",
      "Marley", "Lizy Tagliani", "Natalia Oreiro", "Facundo Arana",
      "Nancy Dupláa", "Peter Lanzani", "Cris Morena", "Andy Kusnetzoff",
      "Juana Viale", "Ángel de Brito", "Paula Chaves", "Pedro Alfonso",
      "Nico Vázquez", "Gimena Accardi", "Benjamín Vicuña", "Luciano Castro",
    ],
  },
  {
    id: "sports",
    label: "Deportes",
    icon: <Trophy size={18} />,
    color: "from-sky-500 to-blue-600",
    words: [
      "Lionel Messi", "Diego Maradona", "Dibu Martínez", "Kun Agüero",
      "Scaloni", "La Bombonera", "El Monumental", "Turismo Carretera",
      "Manu Ginóbili", "Del Potro", "Los Pumas", "Las Leonas",
      "Mundial Qatar", "Boca Juniors", "River Plate", "El VAR",
      "Ángel Di María", "Julián Álvarez", "Enzo Fernández", "Racing Club",
      "Independiente", "San Lorenzo", "Estudiantes", "Newells",
      "Rosario Central", "Vélez", "Gallardo", "Riquelme", "Batistuta",
      "Caniggia", "Copa América", "Superclásico", "Clásico", "La Scaloneta",
    ],
  },
  {
    id: "food",
    label: "Comida",
    icon: <Utensils size={18} />,
    color: "from-orange-500 to-red-500",
    words: [
      "Asado", "Choripán", "Milanesa con puré", "Empanadas",
      "Locro", "Pizza de Güerrín", "Fugazzetta", "Mate",
      "Fernet con Coca", "Vino Malbec", "Dulce de Leche", "Alfajor",
      "Facturas", "Chocotorta", "Polenta", "Tereré", "Sanguche de Miga",
      "Medialunas", "Provoleta", "Chimichurri", "Humita", "Carbonada",
      "Matambre a la pizza", "Sorrentinos", "Ravioles", "Ñoquis del 29",
      "Pancho", "Bondiola", "Vacío", "Tira de asado", "Costilla",
      "Parrillada", "Achuras", "Morcilla", "Chinchulín", "Mollejas",
    ],
  },
  {
    id: "joda",
    label: "De Joda",
    icon: <Beer size={18} />,
    color: "from-indigo-500 to-purple-800",
    words: [
      "Boliche", "Previa", "After", "Fernet", "Pogo",
      "Sector VIP", "Patovica", "Cumbia", "RKT", "Resaca",
      "Comida de salida", "Jarra Loca", "Quebrar", "Perreo", "Bresh",
      "Escabio", "Chupe", "Mamarse", "Estar en pedo",
      "Reventarse", "Careta", "Levante", "Chamuyar", "Bailanta",
      "Electrónica", "Reggaetón", "Cuarteto", "DJ", "Barra libre",
      "Brindis", "Chela", "Birra", "Trago", "Shot", "Campari", "Fasito",
    ],
  },
  {
    id: "places",
    label: "Lugares",
    icon: <MapPin size={18} />,
    color: "from-blue-400 to-cyan-500",
    words: [
      "El Obelisco", "Mar del Plata", "Bariloche", "Cataratas del Iguazú",
      "Glaciar Perito Moreno", "Caminito", "Puerto Madero", "Villa Gesell",
      "Carlos Paz", "Conurbano", "Ushuaia", "Av. 9 de Julio",
      "Casa Rosada", "La Costa", "Palermo", "Recoleta", "San Telmo",
      "Mendoza", "Salta", "Córdoba Capital", "Rosario", "La Plata",
      "Tigre", "Pinamar", "Cariló", "Las Grutas", "Península Valdés",
      "El Chaltén", "El Calafate", "Cerro Catedral", "Valle de la Luna",
      "Cafayate", "Tafí del Valle", "Tandil", "Sierra de la Ventana",
    ],
  },
  {
    id: "music",
    label: "Música",
    icon: <Music size={18} />,
    color: "from-pink-500 to-rose-500",
    words: [
      "Charly García", "Fito Páez", "Gustavo Cerati", "Duki",
      "Bizarrap", "Tini", "María Becerra", "Gilda", "Rodrigo",
      "Sandro", "La Mona Jiménez", "Callejero Fino", "L-Gante",
      "Tan Biónica", "Los Redondos", "Soda Stereo", "Virus", "Los Auténticos Decadentes",
      "Los Fabulosos Cadillacs", "Spinetta", "Los Pericos",
      "Bersuit", "Divididos", "Nicki Nicole", "Trueno", "Wos",
      "Paulo Londra", "Luck Ra", "La Konga", "La Barra", "Ráfaga",
    ],
  },
  {
    id: "brands",
    label: "Marcas Arg",
    icon: <ShoppingBag size={18} />,
    color: "from-yellow-500 to-amber-600",
    words: [
      "Manaos", "Marolio", "Coto", "Carrefour", "MercadoLibre",
      "Tarjeta SUBE", "Flybondi", "Aerolíneas Argentinas", "YPF",
      "Mostaza", "Grido", "Quilmes", "Playadito", "Termidor", "La Serenísima",
      "Arcor", "Bagley", "Terrabusi", "Havanna", "Cachafaz",
      "La Campagnola", "Personal", "Movistar", "Claro", "Día",
      "Disco", "Jumbo", "Easy", "Garbarino", "Frávega", "Musimundo",
      "Farmacity", "Pedidos Ya", "Rappi", "Cabify", "Tarjeta Naranja", "Bic",
    ],
  },
  {
    id: "internet",
    label: "Internet",
    icon: <Smartphone size={18} />,
    color: "from-teal-400 to-emerald-600",
    words: [
      "TikTok", "Instagram", "WhatsApp", "Twitter (X)", "Youtuber",
      "Streamer", "Coscu", "Ibai", "Meme", "Viral", "Wifi",
      "Influencer", "Canje", "Selfie", "Sticker", "Facebook",
      "Telegram", "Discord", "Twitch", "YouTube", "Reddit",
      "Trend", "Challenge", "Hashtag", "DM", "Story",
      "Reel", "Live", "Reaction", "Pov", "Cringe",
      "Like", "Follow", "Subscribe", "Spoiler", "Thread",
    ],
  },
  {
    id: "jobs",
    label: "Profesiones",
    icon: <Briefcase size={18} />,
    color: "from-slate-500 to-slate-700",
    words: [
      "Albañil", "Doctor", "Maestra Jardinera", "Colectivero",
      "Taxista", "Programador", "Abogado", "Policía", "Bombero",
      "Carnicero", "Verdulero", "Kiosquero", "Delivery", "Presidente",
      "Enfermera", "Contador", "Arquitecto", "Plomero", "Electricista",
      "Mecánico", "Carpintero", "Peluquero", "Chef", "Mozo",
      "Cajero", "Vendedor", "Secretaria", "Periodista", "Fotógrafo",
      "Ingeniero", "Maestro", "Profesor", "Chofer de Uber", "Repositor",
    ],
  },
  {
    id: "animals",
    label: "Animales",
    icon: <Dog size={18} />,
    color: "from-green-500 to-green-700",
    words: [
      "Perro", "Gato", "Carpincho", "Hornero", "Vaca", "Caballo",
      "León", "Tiburón", "Mosquito", "Cucaracha", "Pingüino",
      "Llama", "Yaguareté", "Ñandú", "Guanaco", "Vicuña",
      "Cóndor", "Loro", "Loro Barranquero", "Carancho", "Benteveo",
      "Oso Hormiguero", "Ciervo", "Puma", "Zorro", "Nutria",
      "Delfín", "Ballena", "Foca", "Elefante Marino", "Cocodrilo",
      "Yacaré", "Iguana", "Tortuga", "Chancho", "Oveja",
    ],
  },
  {
    id: "spicy",
    label: "Picante +18",
    icon: <Flame size={18} />,
    color: "from-rose-600 to-red-900",
    is18: true,
    words: [
      "Dildo", "Vibrador", "Esposas", "Látigo", "Lubricante",
      "Sex Shop", "Telo", "Tanga", "Striptease", "Kamasutra",
      "OnlyFans", "Tinder", "Playa Nudista", "Cuarto Oscuro",
      "Trío", "Sexo en el auto", "Nudes", "Preservativo",
      "Viagra", "Lencería", "Masaje Erótico",
      "Juguetes Sexuales", "Video Hot", "Sexting",
      "Pack", "Happn", "Beso Negro",
      "69", "Roleplay", "Fetiche", "Transa",
    ],
  },
];

const CHAOS_RULES = [
  "🤫 Hablar solo susurrando.",
  "😡 Hablar como si estuvieran enojados.",
  "🧐 Hablar muy formal (Usted).",
  "🇬🇧 Spanglish: Usar palabras en inglés.",
  "🤐 No se puede decir 'Sí' ni 'No'.",
  "✋ Prohibido usar las manos al hablar.",
  "⏱️ Tienen que hablar super rápido.",
  "💅 Hablar como Milipili / Cheto.",
  "🤠 Hablar como gaucho.",
  "❓ Todo lo que digan debe ser una pregunta.",
];

// --- COMPONENTES UI REUTILIZABLES ---
const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  sound = "click",
  disabled,
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled) {
      playSound(sound);
      vibrate(10);
      if (onClick) onClick(e);
    }
  };
  const baseStyle =
    "w-full py-4 rounded-xl font-bold shadow-lg transform transition active:scale-[0.98] flex items-center justify-center gap-2 select-none touch-manipulation";
  const variants = {
    primary:
      "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sky-900/20",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-900/20",
    success:
      "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-900/20",
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [gameState, setGameState] = useState("home");
  const [showRules, setShowRules] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chaosMode, setChaosMode] = useState(false);

  // Settings & Persistence
  const [playerCount, setPlayerCount] = useState(4);
  const [imposterCount, setImposterCount] = useState(1);

  const [customCategories, setCustomCategories] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("impostor_custom_cats");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [customNames, setCustomNames] = useState(() => {
    if (typeof window !== "undefined") {
      const savedNames = localStorage.getItem("impostor_names");
      return savedNames
        ? JSON.parse(savedNames)
        : ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"];
    }
    return ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"];
  });

  const [selectedCatIds, setSelectedCatIds] = useState([
    "tv",
    "sports",
    "food",
    "joda",
    "music",
    "brands",
  ]);

  const [newCatName, setNewCatName] = useState("");
  const [newCatWords, setNewCatWords] = useState("");

  // Game Data
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Bloqueo durante animación
  const [secretWord, setSecretWord] = useState("");
  const [secretCategory, setSecretCategory] = useState("");
  const [secretCategoryId, setSecretCategoryId] = useState(""); // ID de la categoría secreta
  const [starterPlayer, setStarterPlayer] = useState("");
  const [currentChaosRule, setCurrentChaosRule] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);

  // --- EFECTOS ---
  useEffect(() => {
    localStorage.setItem(
      "impostor_custom_cats",
      JSON.stringify(customCategories)
    );
  }, [customCategories]);
  useEffect(() => {
    localStorage.setItem("impostor_names", JSON.stringify(customNames));
  }, [customNames]);

  // --- LOGICA ---
  const handlePlayerCountChange = (val) => {
    setPlayerCount(val);
    const newNames = [...customNames];
    if (val > customNames.length) {
      for (let i = customNames.length; i < val; i++)
        newNames.push(`Jugador ${i + 1}`);
    }
    setCustomNames(newNames);
    if (imposterCount >= val) setImposterCount(Math.max(1, val - 1));
  };

  const updateName = (idx, val) => {
    const newNames = [...customNames];
    newNames[idx] = val;
    setCustomNames(newNames);
  };

  const createCategory = () => {
    if (!newCatName.trim() || !newCatWords.trim()) return;
    const wordsArray = newCatWords
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
    if (wordsArray.length < 2) return;

    const newCat = {
      id: `custom_${Date.now()}`,
      label: newCatName,
      icon: <Sparkles size={18} />,
      color: "from-pink-500 to-rose-500",
      words: wordsArray,
      isCustom: true,
    };

    setCustomCategories([...customCategories, newCat]);
    setSelectedCatIds([...selectedCatIds, newCat.id]);
    setNewCatName("");
    setNewCatWords("");
    setShowCreator(false);
    playSound("flip");
  };

  const deleteCategory = (id) => {
    setCustomCategories(customCategories.filter((c) => c.id !== id));
    setSelectedCatIds(selectedCatIds.filter((cid) => cid !== id));
  };

  const startGame = () => {
    const allCats = [...DEFAULT_CATEGORIES, ...customCategories];
    let pool = [];
    const activeCategories = allCats.filter((c) =>
      selectedCatIds.includes(c.id)
    );
    const catsToUse = activeCategories.length
      ? activeCategories
      : DEFAULT_CATEGORIES;

    catsToUse.forEach((c) => {
      pool = [...pool, ...c.words.map((w) => ({ word: w, category: c.label, catId: c.id }))];
    });

    const selection = pool[Math.floor(Math.random() * pool.length)];
    setSecretWord(selection.word);
    setSecretCategory(selection.category);
    setSecretCategoryId(selection.catId);

    if (chaosMode) {
      const rule =
        CHAOS_RULES[Math.floor(Math.random() * CHAOS_RULES.length)];
      setCurrentChaosRule(rule);
    } else {
      setCurrentChaosRule(null);
    }

    let roles = Array(playerCount).fill("civilian");
    let assigned = 0;
    while (assigned < imposterCount) {
      const r = Math.floor(Math.random() * playerCount);
      if (roles[r] === "civilian") {
        roles[r] = "imposter";
        assigned++;
      }
    }

    const newPlayers = roles.map((role, idx) => ({
      id: idx,
      name: customNames[idx] || `Jugador ${idx + 1}`,
      role,
      avatarColor: [
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-rose-500",
        "bg-orange-500",
        "bg-emerald-500",
        "bg-cyan-500",
      ][idx % 7],
    }));

    setStarterPlayer(
      newPlayers[Math.floor(Math.random() * newPlayers.length)].name
    );
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setIsRevealing(false);
    setGameState("assign");
  };

  const nextStep = () => {
    if (isProcessing) return; // Bloqueo de animación

    if (isRevealing) {
      // Ocultar (Inicia animación de cierre)
      setIsRevealing(false);
      setIsProcessing(true); // Bloquear interacción

      // Esperar a que la carta termine de girar (600ms) antes de cambiar los datos
      setTimeout(() => {
        if (currentPlayerIndex < playerCount - 1) {
          setCurrentPlayerIndex((prev) => prev + 1);
        } else {
          setGameState("discuss");
          setTimeLeft(playerCount * 60);
          setTimerActive(true);
          if (chaosMode) playSound("chaos");
        }
        setIsProcessing(false); // Desbloquear
      }, 600); // Sincronizado con CSS transition
    } else {
      // Revelar
      playSound("flip");
      vibrate(50);
      setIsRevealing(true);
    }
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      playSound("alarm");
      vibrate([200, 100, 500]);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // --- VISTAS ---

  // 1. HOME SCREEN
  if (gameState === "home") {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1),rgba(15,23,42,0)_50%)]"></div>

        <div className="z-10 w-full max-w-sm flex justify-end gap-2 absolute top-4 right-4 px-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-slate-900/50 rounded-full text-slate-400 backdrop-blur-md border border-slate-800"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        <div className="z-10 text-center space-y-8 max-w-sm w-full animate-in fade-in zoom-in duration-700">
          <div
            className="relative inline-block group cursor-pointer"
            onClick={() => playSound("click")}
          >
            <div className="absolute inset-0 bg-sky-500 blur-3xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
            <Skull
              size={80}
              className="relative z-10 mx-auto text-sky-400 mb-4 drop-shadow-2xl"
            />
          </div>
          <div>
            <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-sky-200">
              IMPOSTOR
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] uppercase font-bold tracking-widest text-sky-400 shadow-xl">
                Edición Definitiva
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-8">
            <Button
              onClick={() => setGameState("setup")}
              className="h-16 text-lg"
            >
              <Play size={24} fill="currentColor" /> JUGAR
            </Button>
            <Button variant="secondary" onClick={() => setShowRules(true)}>
              <HelpCircle size={18} /> CÓMO JUGAR
            </Button>
          </div>
        </div>

        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative">
              <h2 className="text-2xl font-black text-white mb-4 italic">
                CÓMO JUGAR
              </h2>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="text-sky-400 font-bold">1.</span>{" "}
                  <p>
                    Todos reciben la misma palabra menos el{" "}
                    <span className="text-rose-400 font-bold">Impostor</span>.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-bold">2.</span>{" "}
                  <p>Describan la palabra por turnos sin ser obvios.</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-bold">3.</span>{" "}
                  <p>El Impostor debe mentir y fingir que sabe.</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 font-bold">4.</span>{" "}
                  <p>
                    Si la palabra secreta es una frase, se avisará al empezar.
                  </p>
                </li>
              </ul>
              <Button className="mt-8" onClick={() => setShowRules(false)}>
                ENTENDIDO
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. SETUP SCREEN
  if (gameState === "setup") {
    const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col p-4 font-sans select-none relative overflow-x-hidden">
        <div className="flex items-center gap-3 mb-6 pt-2">
          <button
            onClick={() => setGameState("home")}
            className="p-2 bg-slate-900 rounded-full border border-slate-800 hover:bg-slate-800"
          >
            <RotateCcw size={18} />
          </button>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Configuración
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar space-y-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-400 uppercase flex gap-2 items-center">
                <Users size={14} /> Jugadores
              </label>
              <span className="text-3xl font-black text-white">
                {playerCount}
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              value={playerCount}
              onChange={(e) =>
                handlePlayerCountChange(parseInt(e.target.value))
              }
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 mb-6"
            />

            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex gap-2 items-center">
                <Skull size={14} /> Impostores
              </label>
              <span className="text-xl font-bold text-rose-500">
                {imposterCount}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={Math.max(1, Math.floor(playerCount - 1))}
              value={imposterCount}
              onChange={(e) => setImposterCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Edit2 size={16} className="text-sky-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Editar Nombres
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {customNames.slice(0, playerCount).map((name, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <input
                    value={name}
                    onChange={(e) => updateName(idx, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-8 pr-2 text-xs font-bold text-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder-slate-700"
                    placeholder={`Jugador ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            onClick={() => {
              setChaosMode(!chaosMode);
              playSound("click");
            }}
            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              chaosMode
                ? "bg-amber-900/20 border-amber-500/50"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  chaosMode
                    ? "bg-amber-500 text-black"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                <Zap size={20} fill={chaosMode ? "currentColor" : "none"} />
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    chaosMode ? "text-amber-400" : "text-slate-300"
                  }`}
                >
                  Modo Caos
                </p>
                <p className="text-[10px] text-slate-500">
                  Reglas locas en cada ronda
                </p>
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full relative transition-colors ${
                chaosMode ? "bg-amber-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  chaosMode ? "left-5" : "left-1"
                }`}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Categorías ({selectedCatIds.length})
              </label>
              <button
                onClick={() => setShowCreator(true)}
                className="flex items-center gap-1 text-[10px] bg-slate-800 text-sky-400 px-3 py-1 rounded-full font-bold border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <Plus size={12} /> Crear Propia
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allCategories.map((cat) => {
                const isSelected = selectedCatIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playSound("click");
                      setSelectedCatIds((prev) =>
                        prev.includes(cat.id)
                          ? prev.length === 1
                            ? prev
                            : prev.filter((c) => c !== cat.id)
                          : [...prev, cat.id]
                      );
                    }}
                    className={`relative p-3 rounded-xl border text-left transition-all duration-200 group active:scale-[0.98] overflow-hidden ${
                      isSelected
                        ? `bg-gradient-to-br ${cat.color} border-transparent shadow-lg`
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected
                            ? "bg-black/20 text-white"
                            : "bg-slate-800 text-slate-600"
                        }`}
                      >
                        {cat.icon}
                      </div>
                      {cat.isCustom && !isSelected && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(cat.id);
                          }}
                          className="p-1.5 hover:bg-red-900/50 hover:text-red-400 rounded text-slate-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </div>
                      )}
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={`block text-xs font-bold leading-tight relative z-10 ${
                        isSelected ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {cat.label}
                    </span>
                    {cat.is18 && (
                      <span className="absolute top-2 right-2 text-[8px] bg-white text-rose-600 font-black px-1.5 rounded-sm z-10">
                        +18
                      </span>
                    )}
                    {cat.isCustom && isSelected && (
                      <span className="absolute -bottom-2 -right-2 text-white/10">
                        <Sparkles size={40} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {showCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex gap-2 items-center">
                  <Sparkles className="text-pink-500" /> Nueva Categoría
                </h3>
                <button onClick={() => setShowCreator(false)}>
                  <X className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Nombre de la lista
                  </label>
                  <input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-pink-500 outline-none mt-1"
                    placeholder="Ej: Amigos del Fútbol"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Palabras (Separadas por coma)
                  </label>
                  <textarea
                    value={newCatWords}
                    onChange={(e) => setNewCatWords(e.target.value)}
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-pink-500 outline-none mt-1 text-sm resize-none"
                    placeholder="Ej: Messi, Cancha de 5, El Asado, Tercer Tiempo..."
                  />
                  <p className="text-[10px] text-slate-600 mt-1 text-right">
                    Mínimo 2 palabras
                  </p>
                </div>
                <Button
                  variant="danger"
                  onClick={createCategory}
                  className="bg-gradient-to-r from-pink-600 to-rose-600"
                >
                  CREAR LISTA
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950 border-t border-slate-900 z-50">
          <div className="max-w-md mx-auto">
            <Button onClick={startGame} className="h-14">
              JUGAR <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ASSIGN SCREEN (PASS AND PLAY - CON ANIMACIÓN 3D FLIP)
  if (gameState === "assign") {
    const player = players[currentPlayerIndex];
    const isImposter = player.role === "imposter";

    return (
      <>
        <style>{`
            .perspective-1000 { perspective: 1000px; }
            .transform-style-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; }
            .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentPlayerIndex / playerCount) * 100}%` }}
            ></div>
          </div>

          <div className="max-w-xs w-full text-center relative z-10">
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div
                className={`w-20 h-20 mx-auto rounded-full ${player.avatarColor} flex items-center justify-center shadow-2xl mb-4 border-4 border-slate-900 ring-2 ring-slate-800`}
              >
                <span className="text-3xl font-bold text-white/90">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isRevealing ? (
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Entregar dispositivo a
                  </p>
                  <h2 className="text-3xl font-black text-white">
                    {player.name}
                  </h2>
                </div>
              ) : (
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Tu Identidad
                  </p>
                  <h2 className="text-3xl font-black text-white">
                    {player.name}
                  </h2>
                </div>
              )}
            </div>

            {/* TARJETA CON FLIP 3D */}
            <div
              className="perspective-1000 w-full h-72 sm:h-80 mb-6 sm:mb-8 cursor-pointer group"
              onClick={nextStep}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 transform-style-3d ${
                  isRevealing ? "rotate-y-180" : ""
                }`}
              >
                {/* FRENTE (OCULTO) */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-900 rounded-2xl border-2 border-slate-700 hover:border-sky-500/50 transition-colors shadow-2xl flex flex-col items-center justify-center p-4 sm:p-6">
                  <div className="w-full h-full border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center">
                    <EyeOff size={40} className="text-slate-600 mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-1 sm:mb-2">
                      Tocar para ver
                    </h3>
                    <p className="text-xs text-slate-500">
                      Asegurate que nadie mire
                    </p>
                  </div>
                </div>

                {/* DORSO (REVELADO) */}
                <div
                  className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border-2 shadow-2xl flex flex-col items-center justify-center p-4 sm:p-6 ${
                    isImposter
                      ? "bg-slate-900 border-rose-500"
                      : "bg-slate-900 border-sky-500"
                  }`}
                >
                  {isImposter ? (
                    <>
                      <Skull
                        size={56}
                        className="text-rose-500 mx-auto mb-3 sm:mb-4 animate-bounce"
                      />
                      <h2 className="text-3xl sm:text-4xl font-black text-rose-500 uppercase tracking-tighter mb-2">
                        IMPOSTOR
                      </h2>
                      <div className="bg-rose-950/50 px-3 py-1 rounded border border-rose-500/30 mt-2 inline-block">
                        <p className="text-rose-200 text-xs font-bold uppercase">
                          Categoría: {secretCategory}
                        </p>
                      </div>
                      <p className="text-rose-400/60 text-[10px] mt-4 sm:mt-6 font-medium">
                        Miente para sobrevivir.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sky-500/60 text-[10px] font-bold uppercase tracking-widest mb-3 sm:mb-4">
                        Palabra Secreta
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-black text-white break-words leading-tight px-2 text-center">
                        {secretWord}
                      </h2>
                      <div className="mt-6 sm:mt-8 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 inline-block">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                          {secretCategory}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={nextStep}
              className={
                isRevealing
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50"
                  : "opacity-0 pointer-events-none"
              }
            >
              {currentPlayerIndex < playerCount - 1
                ? "Ocultar y Siguiente"
                : "Comenzar Juego"}
            </Button>
          </div>
        </div>
      </>
    );
  }

  // 4. DISCUSS SCREEN
  if (gameState === "discuss") {
    // Detectamos si es una categoría de Nombres (tv, sports, music)
    const isNameCat = ["tv", "sports", "music"].includes(secretCategoryId);

    // Solo mostramos el aviso si TIENE espacio Y NO es una categoría de nombres
    const isPhrase = secretWord.trim().indexOf(" ") !== -1 && !isNameCat;

    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col p-4 sm:p-6 font-sans select-none overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                timerActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            ></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Debate
            </span>
          </div>
          <button
            onClick={() => {
              playSound("click");
              setTimerActive(!timerActive);
            }}
            className={`p-2 rounded-lg border transition-all active:scale-95 ${
              timerActive
                ? "bg-slate-900 border-slate-800 text-slate-400"
                : "bg-emerald-900/20 border-emerald-500/30 text-emerald-500"
            }`}
          >
            {timerActive ? (
              <span className="text-[10px] font-bold px-2">PAUSAR</span>
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center">
          {isPhrase && (
            <div className="bg-indigo-900/50 border border-indigo-500/30 px-4 py-2 rounded-full mb-6 animate-pulse">
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="text-lg">📝</span> Atención: Es una frase
              </p>
            </div>
          )}

          {chaosMode && currentChaosRule && (
            <div className="w-full max-w-sm bg-amber-500 text-amber-950 p-4 rounded-xl mb-4 animate-in slide-in-from-top-4 shadow-lg shadow-amber-900/20 border-2 border-amber-400">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={18} fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-widest">
                  REGLA CAOS ACTIVADA
                </span>
              </div>
              <p className="text-lg font-bold leading-tight">
                {currentChaosRule}
              </p>
            </div>
          )}

          <div className="relative mb-6 sm:mb-8 py-4">
            <div
              className={`text-6xl sm:text-8xl font-black font-mono tracking-tighter relative z-10 tabular-nums transition-colors duration-300 ${
                timeLeft < 30 ? "text-rose-500 scale-110" : "text-white"
              }`}
            >
              {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
              {timeLeft % 60}
            </div>
          </div>

          <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6 flex items-center gap-4 shadow-lg">
            <div className="bg-slate-800 p-2.5 rounded-full text-sky-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Empieza
              </p>
              <p className="text-xl font-black text-white leading-none">
                {starterPlayer}
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-wrap justify-center gap-2 mb-6">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 opacity-70"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${p.avatarColor}`}
                ></div>
                <span className="text-[10px] font-bold text-slate-300 uppercase">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          <Button
            variant="danger"
            onClick={() => setGameState("reveal")}
            className="mt-auto mb-4"
          >
            <Skull size={20} /> FINALIZAR Y VOTAR
          </Button>
        </div>
      </div>
    );
  }

  // 5. REVEAL SCREEN
  if (gameState === "reveal") {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-white p-4 sm:p-6 overflow-y-auto font-sans">
        <div className="max-w-md mx-auto pb-10 pt-4 px-2">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white mb-2">
              Resultados
            </h1>
            <p className="text-slate-400 text-sm font-medium">¿Lo atraparon?</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              La palabra era
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-sky-400 break-words mb-2 px-2">
              {secretWord}
            </h2>
            <span className="inline-block px-2 py-1 bg-slate-950 rounded text-[10px] text-slate-400 font-bold uppercase tracking-wider border border-slate-800">
              {secretCategory}
            </span>
          </div>

          <div className="space-y-3">
            {players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  p.role === "imposter"
                    ? "bg-rose-950/20 border-rose-500/30"
                    : "bg-slate-900/50 border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${p.avatarColor} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className={`font-bold text-sm ${
                        p.role === "imposter"
                          ? "text-rose-400"
                          : "text-slate-200"
                      }`}
                    >
                      {p.name}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {p.role === "imposter" ? "Impostor" : "Ciudadano"}
                    </p>
                  </div>
                </div>
                {p.role === "imposter" && (
                  <Skull size={18} className="text-rose-500" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              variant="secondary"
              onClick={() => setGameState("home")}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
