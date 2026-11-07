import type { Situation } from "@/engine/types";

/**
 * Mundo 1. Alternativas: matriz de la V2 §5 (la 8 es «miedo a exponer», V2 §2). Historias: V1 §4,
 * en tercera persona. Consecuencias redactadas para la demo: pendientes de revisión psicológica.
 * Los textos se editan aquí sin tocar el programa.
 */
export const AULA: Situation[] = [
  {
    id: 1,
    world: "aula",
    title: "¡No me sale el ejercicio!",
    story:
      "La profesora explica una actividad de matemáticas. Todos comienzan a trabajar, pero {n} no entiende qué debe hacer.",
    feels: ["enojo", "tristeza"],
    validation: "Da mucha rabia cuando algo no sale. Sentir eso es normal.",
    learning:
      "Es normal que algo no salga a la primera. Pedir ayuda es una manera inteligente de aprender.",
    strategy: "Pedir ayuda",
    topic: "frustracion",
    skills: ["resuelvo", "intento"],
    set: "classroom",
    npcs: ["teacher", "peer"],
    prop: "notebook",
    options: [
      {
        id: "A",
        text: "Rayar el cuaderno.",
        icon: "✏️",
        react: "breakThing",
        consequence:
          "La hoja queda llena de rayas y el ejercicio sigue igual. Ahora también hay que limpiar el cuaderno.",
      },
      {
        id: "B",
        text: "Molestar a alguien.",
        icon: "😤",
        react: "harm",
        consequence:
          "El compañero se distrae y se incomoda. Ninguno de los dos avanza con su trabajo.",
      },
      {
        id: "C",
        text: "Pedir una explicación o una pista.",
        icon: "🙋",
        react: "ask",
        recommended: true,
        consequence:
          "{n} levanta la mano. La profesora se acerca y juntos resuelven el primer ejercicio.",
      },
      {
        id: "D",
        text: "Copiar sin entender.",
        icon: "👀",
        react: "sneak",
        consequence:
          "La hoja se llena, pero {n} sigue sin entender. En el próximo ejercicio aparece la misma duda.",
      },
      {
        id: "E",
        text: "Abandonar la actividad.",
        icon: "🛑",
        react: "giveUp",
        consequence:
          "Los demás siguen avanzando y el ejercicio queda sin hacer. La duda todavía está ahí.",
      },
    ],
  },
  {
    id: 2,
    world: "aula",
    title: "Mi dibujo no quedó como quería",
    story: "{n} dibujó un animal, pero no se parece al que imaginaba.",
    feels: ["tristeza", "enojo"],
    validation: "Es desagradable cuando algo no queda como lo imaginabas.",
    learning: "La práctica ayuda a mejorar. No todo tiene que quedar perfecto.",
    strategy: "Descansar y cambiar de técnica",
    topic: "frustracion",
    skills: ["intento", "calma"],
    set: "classroom",
    npcs: ["teacher"],
    prop: "drawing",
    options: [
      {
        id: "A",
        text: "Romper el dibujo.",
        icon: "📄",
        react: "breakThing",
        consequence:
          "El dibujo queda en pedazos. Ya no se puede ver qué partes habían salido bien.",
      },
      {
        id: "B",
        text: "Compararse con los demás.",
        icon: "⚖️",
        react: "giveUp",
        consequence: "{n} mira los otros dibujos y se siente peor. Su propio dibujo no cambia.",
      },
      {
        id: "C",
        text: "Guardarlo y no volver a dibujar.",
        icon: "🎒",
        react: "withdraw",
        consequence:
          "El dibujo queda guardado, y también las ganas de dibujar. No hay oportunidad de practicar.",
      },
      {
        id: "D",
        text: "Descansar y probar otra técnica.",
        icon: "🎨",
        react: "retry",
        recommended: true,
        consequence:
          "{n} respira, prueba con otros colores y formas, y descubre que el animal empieza a parecerse.",
      },
      {
        id: "E",
        text: "Enojarse con quien enseña.",
        icon: "😠",
        react: "blame",
        consequence:
          "La profesora escucha el reclamo, pero el dibujo sigue igual y el momento se pone tenso.",
      },
    ],
  },
  {
    id: 3,
    world: "aula",
    title: "Un compañero terminó primero",
    story: "{n} está trabajando y observa que otro compañero ya terminó su actividad.",
    feels: ["verguenza", "tristeza"],
    validation: "Puede preocupar ver que alguien termina antes. Le pasa a mucha gente.",
    learning: "Cada persona aprende a su ritmo.",
    strategy: "Seguir a su propio ritmo",
    topic: "frustracion",
    skills: ["intento", "reconozco"],
    set: "classroom",
    npcs: ["peer", "teacher"],
    prop: "notebook",
    options: [
      {
        id: "A",
        text: "Copiar las respuestas.",
        icon: "👀",
        react: "sneak",
        consequence:
          "La actividad parece terminada, pero {n} no aprendió cómo hacerla. La duda vuelve después.",
      },
      {
        id: "B",
        text: "Continuar a su ritmo.",
        icon: "🐢",
        react: "retry",
        recommended: true,
        consequence:
          "{n} sigue tranquilamente, pide orientación cuando la necesita y termina su trabajo entendiéndolo.",
      },
      {
        id: "C",
        text: "Abandonar la actividad.",
        icon: "🛑",
        react: "giveUp",
        consequence:
          "El cuaderno queda sin terminar. Faltaba poco, pero no hubo tiempo de descubrirlo.",
      },
      {
        id: "D",
        text: "Interrumpir al compañero.",
        icon: "🗣️",
        react: "harm",
        consequence: "El compañero se molesta porque lo distraen, y {n} tampoco avanza.",
      },
      {
        id: "E",
        text: "Decir que no sirve para estudiar.",
        icon: "🌧️",
        react: "withdraw",
        consequence:
          "Ese pensamiento hace que todo parezca más difícil, aunque no sea verdad. Una tarea no dice quién es una persona.",
      },
    ],
  },
  {
    id: 4,
    world: "aula",
    title: "La profesora corrigió mi respuesta",
    story: "La profesora explica que una respuesta de {n} está equivocada.",
    feels: ["verguenza", "enojo"],
    validation: "Que te corrijan puede dar vergüenza o enojo, y es comprensible.",
    learning: "Una corrección puede ayudar a aprender. Equivocarse no significa ser incapaz.",
    strategy: "Escuchar y preguntar",
    topic: "frustracion",
    skills: ["intento", "resuelvo"],
    set: "classroom",
    npcs: ["teacher"],
    prop: "paper",
    options: [
      {
        id: "A",
        text: "Gritar.",
        icon: "📢",
        react: "outburst",
        consequence:
          "La clase se detiene y todos miran. La profesora no puede seguir explicando y la duda se queda.",
      },
      {
        id: "B",
        text: "Arrugar el trabajo.",
        icon: "🗑️",
        react: "breakThing",
        consequence: "El trabajo queda arrugado, y con él también las partes que estaban bien.",
      },
      {
        id: "C",
        text: "Ignorar la explicación.",
        icon: "🙉",
        react: "withdraw",
        consequence:
          "La explicación pasa sin que nadie la escuche. Es probable que el mismo error aparezca otra vez.",
      },
      {
        id: "D",
        text: "Culpar a otra persona.",
        icon: "👉",
        react: "blame",
        consequence:
          "El compañero se siente mal porque no tuvo que ver. La respuesta sigue sin corregirse.",
      },
      {
        id: "E",
        text: "Escuchar y preguntar cómo mejorar.",
        icon: "👂",
        react: "ask",
        recommended: true,
        consequence:
          "La profesora muestra dónde estuvo el error y {n} lo intenta otra vez. Esta vez sale mejor.",
      },
    ],
  },
  {
    id: 5,
    world: "aula",
    title: "No me eligieron primero",
    story:
      "La profesora invita a otro estudiante a pasar al frente, y {n} también quería participar.",
    feels: ["tristeza", "enojo"],
    validation: "Es una decepción querer participar y tener que esperar.",
    learning: "Se puede sentir decepción y aun así respetar los turnos.",
    strategy: "Esperar y expresar el deseo",
    topic: "comunicacion",
    skills: ["calma", "reconozco"],
    set: "classroom",
    npcs: ["teacher", "peer"],
    prop: "none",
    options: [
      {
        id: "A",
        text: "Interrumpir.",
        icon: "✋",
        react: "outburst",
        consequence: "El compañero pierde el hilo de lo que decía y la actividad se detiene.",
      },
      {
        id: "B",
        text: "Gritar.",
        icon: "📢",
        react: "outburst",
        consequence:
          "Todos se sobresaltan. La profesora debe pedir calma y el turno no llega más rápido.",
      },
      {
        id: "C",
        text: "Esperar y expresar que también desea participar.",
        icon: "⏳",
        react: "talk",
        recommended: true,
        consequence:
          "{n} espera y lo dice con tranquilidad. La profesora lo anota y le da un turno más tarde.",
      },
      {
        id: "D",
        text: "Burlarse.",
        icon: "😝",
        react: "insult",
        consequence:
          "El compañero que está al frente se pone nervioso y se siente mal. El ambiente de la clase cambia.",
      },
      {
        id: "E",
        text: "Negarse a participar después.",
        icon: "🙅",
        react: "withdraw",
        consequence:
          "Cuando llega el turno, {n} dice que no. La oportunidad que tanto quería se pasa.",
      },
    ],
  },
  {
    id: 6,
    world: "aula",
    title: "Se me rompió el lápiz",
    story: "{n} está haciendo una actividad importante y la punta del lápiz se rompe.",
    feels: ["enojo"],
    validation: "Qué molesto que pase justo en ese momento.",
    learning: "Un problema pequeño puede tener varias soluciones.",
    strategy: "Buscar una solución",
    topic: "problemas",
    skills: ["resuelvo", "calma"],
    set: "classroom",
    npcs: ["peer"],
    prop: "pencil",
    options: [
      {
        id: "A",
        text: "Tirar el lápiz.",
        icon: "💢",
        react: "breakThing",
        consequence:
          "El lápiz rueda lejos debajo de los bancos. Ahora hay que ir a buscarlo y la punta sigue rota.",
      },
      {
        id: "B",
        text: "Buscar un sacapuntas o pedir otro lápiz.",
        icon: "✏️",
        react: "repair",
        recommended: true,
        consequence: "En un momento la punta está lista. {n} continúa con su actividad.",
      },
      {
        id: "C",
        text: "Dejar la tarea.",
        icon: "🛑",
        react: "giveUp",
        consequence: "La actividad queda sin hacer por un problema que tenía una solución pequeña.",
      },
      {
        id: "D",
        text: "Culpar a otra persona.",
        icon: "👉",
        react: "blame",
        consequence: "El compañero se siente acusado sin motivo y la punta sigue rota.",
      },
      {
        id: "E",
        text: "Romper otros lápices.",
        icon: "💥",
        react: "breakThing",
        consequence: "Ahora hay más lápices rotos y menos con qué escribir. El problema creció.",
      },
    ],
  },
  {
    id: 7,
    world: "aula",
    title: "Trabajar con alguien diferente",
    story:
      "La profesora organiza grupos y a {n} le toca trabajar con alguien que no es de sus amistades.",
    feels: ["verguenza", "miedo"],
    validation: "Da un poco de nervios trabajar con alguien que casi no conoces.",
    learning: "Se puede colaborar aunque no sean mejores amistades.",
    strategy: "Conversar y repartir tareas",
    topic: "comunicacion",
    skills: ["comprendo", "resuelvo"],
    set: "classroom",
    npcs: ["peer", "teacher"],
    prop: "paper",
    options: [
      {
        id: "A",
        text: "Excluirlo del trabajo.",
        icon: "🚫",
        react: "harm",
        consequence:
          "El compañero queda de lado y se pone triste. El trabajo se hace con menos ideas.",
      },
      {
        id: "B",
        text: "No participar.",
        icon: "🙅",
        react: "withdraw",
        consequence: "El trabajo avanza lento y queda todo para una sola persona.",
      },
      {
        id: "C",
        text: "Imponer todas las decisiones.",
        icon: "👑",
        react: "blame",
        consequence: "El compañero deja de opinar. Se pierden ideas que podían ser muy buenas.",
      },
      {
        id: "D",
        text: "Conversar y repartir tareas.",
        icon: "🤝",
        react: "talk",
        recommended: true,
        consequence:
          "Se presentan, acuerdan quién hace cada parte y descubren que juntos terminan antes.",
      },
      {
        id: "E",
        text: "Hacer todo sin dejar colaborar.",
        icon: "🏋️",
        react: "withdraw",
        consequence: "{n} termina con mucho trabajo y el compañero no pudo aportar nada.",
      },
    ],
  },
  {
    id: 8,
    world: "aula",
    title: "¡Qué nervios hablar delante de todos!",
    story:
      "La profesora pide a {n} que presente su trabajo delante de la clase. Siente nervios, le sudan las manos y teme olvidar lo que tiene que decir.",
    feels: ["miedo", "verguenza"],
    validation: "Sentir nervios antes de hablar frente a otras personas le pasa a mucha gente.",
    learning: "Los nervios pueden acompañarnos y aun así podemos empezar poco a poco, con apoyo.",
    strategy: "Respirar y empezar con una frase corta",
    topic: "calma",
    skills: ["calma", "reconozco"],
    set: "classroom",
    npcs: ["teacher", "peer", "peer2"],
    prop: "paper",
    options: [
      {
        id: "A",
        text: "Salir corriendo del aula sin avisar.",
        icon: "🏃",
        react: "flee",
        consequence:
          "Por un momento los nervios bajan, pero la profesora se preocupa porque no sabe dónde está {n}.",
      },
      {
        id: "B",
        text: "Decir que el trabajo es horrible y romper la hoja.",
        icon: "📄",
        react: "breakThing",
        consequence:
          "La hoja se rompe y se pierde todo lo que había preparado. Los nervios siguen ahí.",
      },
      {
        id: "C",
        text: "Esconderse detrás de otro compañero.",
        icon: "🙈",
        react: "withdraw",
        consequence: "Nadie puede ver su trabajo. El miedo sigue esperando para la próxima vez.",
      },
      {
        id: "D",
        text: "Gritar a los compañeros para que dejen de mirar.",
        icon: "📢",
        react: "outburst",
        consequence:
          "Los compañeros se sorprenden y se sienten mal. Ahora hay más tensión en la clase.",
      },
      {
        id: "E",
        text: "Respirar lentamente, pedir apoyo y comenzar con una frase corta.",
        icon: "🌬️",
        react: "breathe",
        recommended: true,
        consequence:
          "{n} respira y la profesora se acerca. Con la primera frase, la voz se hace más firme.",
      },
    ],
  },
];
