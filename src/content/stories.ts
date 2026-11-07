/**
 * Los seis cuentos del Bosque de la Calma (V2 §3). Ideas del documento; textos redactados para la
 * demo, pendientes de revisión. Las estrategias aparecen dentro de la historia, nunca como teoría.
 * Las interacciones no tienen respuestas penalizadas.
 */
export type WidgetId = "traffic" | "volcano" | "breath" | "tower" | "phrases" | "cloud" | "choice";

export interface ChoiceWidget {
  prompt: string;
  options: { icon: string; text: string; reply: string }[];
}

export type Mood = "calm" | "joy" | "sad" | "angry" | "scared";

export interface StoryPage {
  text: string;
  mood: Mood;
  /** Interacción de la página (entre 2 y 3 por cuento). */
  widget?: WidgetId;
  choice?: ChoiceWidget;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  icon: string;
  art: "traffic" | "volcano" | "turtle" | "tower" | "hedgehog" | "cloud";
  tint: string;
  pages: StoryPage[];
}

export const STORIES: Story[] = [
  {
    id: "semaforo",
    title: "El semáforo de las emociones",
    summary: "Rojo para detenerse, amarillo para respirar y verde para elegir.",
    icon: "🚦",
    art: "traffic",
    tint: "var(--coral)",
    pages: [
      {
        mood: "calm",
        text: "En una esquina del Bosque de la Calma vivía Lumi, un pequeño semáforo que iluminaba el camino de todos los que pasaban. A Lumi le encantaba ver a los animales ir y venir, cada uno con sus cosas, sus prisas y sus historias.",
      },
      {
        mood: "angry",
        text: "Una mañana, dos ardillas empezaron a discutir por una bellota. Hablaban cada vez más fuerte. Una tenía la cara caliente, las manos apretadas y el corazón muy rápido. Sentía tanto enojo que ya no podía escuchar a nadie.",
      },
      {
        mood: "calm",
        text: "Lumi les dijo con voz suave: «Las emociones pueden ser como mis luces. Sentir enojo no está mal. Las luces solo nos ayudan a saber qué hacer ahora». Y les mostró sus tres colores, uno por uno. Rojo para detenerse. Amarillo para respirar y pensar. Verde para elegir algo seguro.",
      },
      {
        mood: "calm",
        text: "Ayuda a Lumi a encender sus luces. Toca cada color cuando quieras y escucha lo que significa.",
        widget: "traffic",
      },
      {
        mood: "calm",
        text: "La ardilla se detuvo. Dio un paso hacia atrás y se quedó quieta un ratito. Luego respiró despacio, sin apuro. La cara se le fue enfriando poco a poco. El enojo seguía allí, pero ya no era tan grande.",
      },
      {
        mood: "joy",
        text: "Entonces vino lo más interesante: la luz verde. «Ahora puedes elegir», dijo Lumi. La ardilla se quedó pensando. Había muchas cosas que podía hacer, y ninguna de ellas tenía que lastimar a nadie.",
      },
      {
        mood: "calm",
        text: "¿Qué podría hacer la ardilla después de la discusión?",
        widget: "choice",
        choice: {
          prompt: "Elige lo que te parezca. Todas las ideas sirven para pensar.",
          options: [
            {
              icon: "💬",
              text: "Decir lo que siente",
              reply:
                "«Me enojé porque yo también quería la bellota». Así la otra ardilla puede entenderla.",
            },
            {
              icon: "🔄",
              text: "Proponer turnos",
              reply: "Hoy una, mañana la otra. Las dos quedan tranquilas.",
            },
            {
              icon: "🦉",
              text: "Pedir ayuda a la lechuza",
              reply: "La lechuza escucha a las dos. Pedir ayuda también es una luz verde.",
            },
          ],
        },
      },
      {
        mood: "joy",
        text: "Las dos ardillas partieron la bellota en dos, y aún sobró para compartir. Desde entonces, cada vez que algo les da mucho calor por dentro, se acuerdan de Lumi. Primero rojo, luego amarillo y después verde. Y tú también puedes llevar un semáforo contigo, a donde vayas.",
      },
    ],
  },
  {
    id: "volcan",
    title: "El volcán que aprendió a escuchar",
    summary: "Reconocer las señales del enojo antes de explotar.",
    icon: "🌋",
    art: "volcano",
    tint: "var(--sun)",
    pages: [
      {
        mood: "calm",
        text: "Detrás de la montaña más alta vivía Bumi, un volcán pequeño y muy curioso. Le gustaba construir torres de piedras, mirar pasar a las nubes y charlar con los pájaros que se paraban en su cima.",
      },
      {
        mood: "angry",
        text: "Pero cuando algo no salía como esperaba, Bumi sentía un calor que subía desde muy adentro. Primero en la barriga, luego en el pecho, luego en la cara. Y a veces, ¡pum!, explotaba y salpicaba todo a su alrededor.",
      },
      {
        mood: "sad",
        text: "Después de explotar, Bumi se quedaba muy triste. Sus torres estaban en el suelo y sus amigos se habían alejado un poco. «Yo no quería asustar a nadie», pensaba. Sentir calor no era el problema. El problema era que no sabía qué hacer con él.",
      },
      {
        mood: "scared",
        text: "Una vieja tortuga se acercó y le dijo: «Tu calor te está avisando de algo. ¿Lo escuchamos juntos?». Mira el termómetro de Bumi. Toca lo que puede ayudarle y observa cómo baja la temperatura.",
        widget: "volcano",
      },
      {
        mood: "calm",
        text: "Bumi empezó a notar las señales. Cuando sentía la barriga caliente, decía en voz alta: «Algo me está molestando». Y solo por decirlo, ya no se sentía tan solo con ese calor.",
      },
      {
        mood: "angry",
        text: "Un día, un pájaro tiró sin querer su torre favorita. Bumi sintió el calor subir, muy rápido. Pero esta vez se alejó un poquito, de manera segura, y buscó a la tortuga antes de explotar.",
      },
      {
        mood: "calm",
        text: "¿Qué señal te avisa a ti cuando el enojo está subiendo?",
        widget: "choice",
        choice: {
          prompt: "Toca la que conozcas, o solo explora.",
          options: [
            {
              icon: "🔥",
              text: "Calor en la cara",
              reply: "A muchas personas les pasa. Es tu cuerpo avisando.",
            },
            {
              icon: "✊",
              text: "Manos apretadas",
              reply: "Puedes abrirlas despacio. A veces ayuda un poquito.",
            },
            {
              icon: "💓",
              text: "Corazón rápido",
              reply: "Respirar despacio le ayuda a tu corazón a ir más tranquilo.",
            },
          ],
        },
      },
      {
        mood: "joy",
        text: "Bumi sigue sintiendo calor algunos días. Todos los volcanes lo sienten. Pero ahora lo escucha, cuenta lo que le pasa y pide ayuda. Y aunque alguna vez salpique un poco, sabe que puede reparar lo que pasó y volver a intentarlo.",
      },
    ],
  },
  {
    id: "tortuga",
    title: "La tortuga que encontró su pausa",
    summary: "Detenerse, respirar lentamente y pedir ayuda.",
    icon: "🐢",
    art: "turtle",
    tint: "var(--leaf)",
    pages: [
      {
        mood: "calm",
        text: "Tula era una tortuga con mucha prisa. Quería llegar primero, terminar primero y aprender todo de una sola vez. Se levantaba corriendo, comía corriendo y hasta soñaba corriendo.",
      },
      {
        mood: "sad",
        text: "Pero un día intentó trepar una piedra muy alta. Lo intentó rápido, y resbaló. Lo intentó más rápido, y resbaló otra vez. Sentía un nudo en la panza y ganas de llorar.",
      },
      {
        mood: "calm",
        text: "Tula metió la cabeza dentro de su caparazón. Adentro estaba oscuro y tranquilo. Y allí, sin querer, hizo algo que nunca hacía: se detuvo. Escuchó su propia respiración, que iba entrando y saliendo.",
      },
      {
        mood: "calm",
        text: "Acompaña a Tula con tres respiraciones suaves. Solo si tienes ganas, y a tu propio ritmo. También puedes solo mirar.",
        widget: "breath",
      },
      {
        mood: "joy",
        text: "Cuando salió de su caparazón, la piedra seguía igual de alta, pero Tula ya no tenía el nudo tan apretado. Miró con calma y vio algo que antes no había visto: a un lado, había unas piedritas que formaban una escalera.",
      },
      {
        mood: "sad",
        text: "Subió la primera y la segunda. En la tercera se quedó sin fuerzas. Antes se habría enojado consigo misma, pero ahora sabía otra cosa.",
      },
      {
        mood: "calm",
        text: "¿Qué podría hacer Tula ahora?",
        widget: "choice",
        choice: {
          prompt: "Toca una idea para ver qué pasa.",
          options: [
            {
              icon: "🧘",
              text: "Hacer otra pausa",
              reply:
                "Descansa un rato y recupera las fuerzas. Las pausas también son parte del camino.",
            },
            {
              icon: "🐇",
              text: "Pedir ayuda al conejo",
              reply: "El conejo la empuja un poquito. ¡Pedir ayuda no le quita mérito!",
            },
            {
              icon: "👣",
              text: "Buscar otro camino",
              reply: "Hay un sendero más largo, pero más suave. También llega arriba.",
            },
          ],
        },
      },
      {
        mood: "joy",
        text: "Desde arriba, Tula miró todo el bosque. No llegó primero. Llegó a su ritmo, con varias pausas y con un poco de ayuda. Y descubrió que lo que más le gustaba del camino era poder disfrutarlo.",
      },
    ],
  },
  {
    id: "torre",
    title: "La torre de los mil intentos",
    summary: "Descansar, cambiar de estrategia y pedir una pista.",
    icon: "🧱",
    art: "tower",
    tint: "var(--sky)",
    pages: [
      {
        mood: "joy",
        text: "Nino quería construir la torre más alta del Bosque de la Calma. Juntó bloques de todos los colores y empezó a apilarlos uno sobre otro, muy contento, imaginando cómo se vería desde lejos.",
      },
      {
        mood: "sad",
        text: "Cuando la torre estaba casi terminada, ¡crash! Se vino abajo y los bloques rodaron por todas partes. Nino sintió una punzada en el pecho. «¡Me quedó mal!», dijo, y se le aguaron los ojos.",
      },
      {
        mood: "calm",
        text: "Un viejo castor se sentó a su lado sin decir nada por un rato. Después le preguntó: «¿Qué aprendió tu torre hoy?». Nino lo pensó. Quizá los bloques grandes debían ir abajo.",
      },
      {
        mood: "calm",
        text: "Ayuda a Nino. Elige una estrategia y mira qué le pasa a la torre.",
        widget: "tower",
      },
      {
        mood: "joy",
        text: "La torre se cayó dos veces más. Cada vez que caía, Nino descubría algo nuevo. Unas veces descansaba, otras cambiaba de estrategia y otras le pedía una pista al castor. Y siempre volvía a construir.",
      },
      {
        mood: "calm",
        text: "¿Qué le dirías a Nino cuando se le cae la torre?",
        widget: "choice",
        choice: {
          prompt: "Elige una frase para acompañarlo.",
          options: [
            {
              icon: "🤗",
              text: "«Entiendo que te moleste»",
              reply: "A Nino le hace bien que alguien lo entienda.",
            },
            {
              icon: "💡",
              text: "«¿Probamos otra forma?»",
              reply: "A Nino se le ocurre una nueva idea.",
            },
            {
              icon: "⏸️",
              text: "«Descansemos un ratito»",
              reply: "Nino toma agua y vuelve con más ganas.",
            },
          ],
        },
      },
      {
        mood: "joy",
        text: "Al final del día, la torre no era la más alta del mundo, pero era la más firme que Nino había hecho. Y lo mejor fue que ya sabía que cuando algo se cae, no todo se pierde. Lo aprendido se queda contigo.",
      },
    ],
  },
  {
    id: "erizo",
    title: "El erizo que aprendió a decir no",
    summary: "Poner límites sin lastimar y respetar los de los demás.",
    icon: "🦔",
    art: "hedgehog",
    tint: "var(--violet)",
    pages: [
      {
        mood: "calm",
        text: "Pipo era un erizo tímido que vivía bajo un gran roble. Tenía muchos amigos: el conejo, la zorra y la ardilla. Le gustaba estar con ellos, pero a veces algo le incomodaba y no sabía cómo decirlo.",
      },
      {
        mood: "sad",
        text: "Al conejo le gustaba abrazarlo muy fuerte, y a Pipo no le gustaba tanto. Se quedaba callado, y por dentro se sentía cada vez más apretado. Hasta que un día, sin querer, sacó todas sus púas, y el conejo saltó hacia atrás, asustado.",
      },
      {
        mood: "sad",
        text: "Pipo se sintió muy mal. No quería lastimar a nadie. Pero tampoco quería seguir sintiéndose así. «¿Cómo hago para decir no sin que nadie se lastime?», le preguntó a la lechuza.",
      },
      {
        mood: "calm",
        text: "La lechuza le enseñó a decirlo con palabras, con voz firme y tranquila. Ayuda a Pipo a escoger frases respetuosas y firmes.",
        widget: "phrases",
      },
      {
        mood: "joy",
        text: "Al día siguiente, cuando el conejo se acercó con los brazos abiertos, Pipo respiró y dijo: «Hoy no quiero abrazos, pero me alegra verte. ¿Chocamos las patas?». El conejo sonrió, y chocaron las patas.",
      },
      {
        mood: "calm",
        text: "Más tarde, Pipo quiso jugar con la ardilla, y la ardilla dijo: «Ahora prefiero estar a solas». A Pipo le dio un poco de pena. ¿Qué podría hacer?",
        widget: "choice",
        choice: {
          prompt: "Los límites de los demás también se respetan.",
          options: [
            {
              icon: "👍",
              text: "«Está bien, otro día»",
              reply: "La ardilla se siente respetada y al rato lo busca.",
            },
            {
              icon: "🌼",
              text: "Buscar otra actividad",
              reply: "Pipo encuentra flores nuevas para mirar.",
            },
            {
              icon: "💬",
              text: "Contar que le dio pena",
              reply: "Decir lo que siente también le ayuda.",
            },
          ],
        },
      },
      {
        mood: "joy",
        text: "Pipo sigue teniendo púas, porque son parte de él. Pero ahora casi no hacen falta. Sabe decir lo que quiere, y sabe escuchar cuando otra persona dice que no. Y sus amigos, ahora, lo conocen un poco mejor.",
      },
    ],
  },
  {
    id: "nube",
    title: "La nube de las emociones",
    summary: "Las emociones aparecen, cambian y no hay que esconderlas.",
    icon: "☁️",
    art: "cloud",
    tint: "var(--sky)",
    pages: [
      {
        mood: "joy",
        text: "Nimbo era una nube que cambiaba de color según lo que sentía. Cuando estaba alegre brillaba de amarillo, y los pájaros venían a jugar a su alrededor. Le encantaba flotar sobre el bosque.",
      },
      {
        mood: "sad",
        text: "Pero cuando sentía tristeza, se ponía azul y le caían unas gotas. Y le daba vergüenza. «Las otras nubes me verán así», pensaba. Entonces intentaba esconder sus colores, y apretaba muy fuerte para ponerse blanca.",
      },
      {
        mood: "scared",
        text: "Esconder los colores era muy cansado. Cuanto más apretaba, más gris se ponía por dentro. Hasta que el viento, que todo lo nota, le preguntó: «Nimbo, ¿qué estás sintiendo de verdad?»",
      },
      {
        mood: "calm",
        text: "El viento le enseñó a mirar sus colores sin miedo. Ayuda a Nimbo: toca cada emoción y mira su color, su cara y qué se siente en el cuerpo.",
        widget: "cloud",
      },
      {
        mood: "sad",
        text: "Ese día, Nimbo dejó caer sus gotas sin esconderlas. Y sucedió algo inesperado: las flores de abajo se pusieron contentas con el agua. Su tristeza no le hacía daño a nadie, y después de llover se sintió más ligero.",
      },
      {
        mood: "angry",
        text: "Otro día se puso rojo porque una ráfaga le desarmó la forma. También se asustó con un trueno. Los colores llegaban, se quedaban un rato y luego cambiaban, como cambia el cielo.",
      },
      {
        mood: "calm",
        text: "¿Qué le ayuda a Nimbo cuando un color se pone muy fuerte?",
        widget: "choice",
        choice: {
          prompt: "Explora las ideas.",
          options: [
            {
              icon: "🗣️",
              text: "Contárselo al viento",
              reply: "Hablar con alguien de confianza hace el camino más liviano.",
            },
            {
              icon: "🌬️",
              text: "Respirar y flotar",
              reply: "Los colores fuertes se van haciendo más suaves.",
            },
            {
              icon: "⏳",
              text: "Dejar que pase",
              reply: "Las emociones aparecen y cambian. Nada se queda para siempre.",
            },
          ],
        },
      },
      {
        mood: "joy",
        text: "Ahora Nimbo flota por el cielo con todos sus colores. No necesita esconderlos, porque cada uno le cuenta algo. Y cuando una nube amiga cambia de color, se acerca y le pregunta: «¿Quieres contarme?»",
      },
    ],
  },
];

export function storyById(id: string): Story | undefined {
  return STORIES.find((story) => story.id === id);
}

export const TOWER_STRATEGIES = [
  {
    icon: "🧱",
    text: "Poner los bloques grandes abajo",
    reply: "¡La base queda firme y la torre sube más!",
  },
  {
    icon: "⏸️",
    text: "Descansar un momento",
    reply: "Con las manos más tranquilas, cada bloque queda mejor puesto.",
  },
  {
    icon: "💡",
    text: "Pedir una pista al castor",
    reply: "«Prueba hacerla más ancha», dice el castor. ¡Funciona!",
  },
];

export const HEDGEHOG_PHRASES = [
  {
    text: "«No me gusta eso. Para, por favor.»",
    firm: true,
    reply: "Es clara y respetuosa. Así se entiende lo que Pipo necesita.",
  },
  {
    text: "«Hoy no quiero abrazos, ¿chocamos las patas?»",
    firm: true,
    reply: "Pone un límite y además ofrece otra idea. ¡Muy bien pensado!",
  },
  {
    text: "«Quiero estar un rato a solas.»",
    firm: true,
    reply: "Es válido pedir espacio. Nadie tiene que enojarse por eso.",
  },
  {
    text: "«¡Vete, tonto!»",
    firm: false,
    reply: "Se entiende el enojo, pero esa palabra lastima. Probemos con otra frase.",
  },
  {
    text: "(Quedarse en silencio)",
    firm: false,
    reply: "A veces cuesta hablar. Si no salen las palabras, se puede buscar a un adulto.",
  },
];

export const VOLCANO_HELPERS = [
  { icon: "🌬️", text: "Respirar lentamente", drop: 25 },
  { icon: "🚶", text: "Alejarse de forma segura", drop: 20 },
  { icon: "💬", text: "Contar lo que siente", drop: 25 },
  { icon: "🧑", text: "Buscar a un adulto", drop: 30 },
];

export const TRAFFIC_LIGHTS = [
  {
    id: "red",
    name: "Rojo",
    say: "Rojo: me detengo. Siento algo muy fuerte y dejo de hacer lo que estoy haciendo.",
  },
  {
    id: "yellow",
    name: "Amarillo",
    say: "Amarillo: respiro y pienso. ¿Qué siento? ¿Qué puedo hacer?",
  },
  {
    id: "green",
    name: "Verde",
    say: "Verde: elijo algo seguro, que no me lastime ni lastime a nadie.",
  },
] as const;

export const CLOUD_FEELINGS = [
  {
    id: "joy",
    name: "Alegría",
    color: "var(--sun)",
    face: "😊",
    body: "Ganas de saltar y sonreír.",
    when: "Cuando juegas con alguien que quieres.",
  },
  {
    id: "sad",
    name: "Tristeza",
    color: "var(--sky)",
    face: "😢",
    body: "Pesadez en el pecho y ganas de llorar.",
    when: "Cuando extrañas a alguien.",
  },
  {
    id: "angry",
    name: "Enojo",
    color: "var(--coral)",
    face: "😠",
    body: "Calor en la cara y manos apretadas.",
    when: "Cuando algo te parece injusto.",
  },
  {
    id: "scared",
    name: "Miedo",
    color: "var(--violet)",
    face: "😨",
    body: "Corazón rápido y mariposas en la panza.",
    when: "Cuando algo es nuevo o desconocido.",
  },
] as const;
