document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 1;
  const totalSlides = 5;
  let intervalId;
  const vimeoPlayers = {};

  // Mapeamento do tempo de duração de cada vídeo (em segundos)
  // AJUSTE AQUI: Coloque o tempo exato de duração de cada um dos seus vídeos do Vimeo
  const videoDurations = {
    's2': 15, // Duração do Vídeo Venom 1
    's3': 30, // Duração do Vídeo Venom 2
    's4': 20, // AJUSTADO: Duração do Novo Vídeo 3 (Exemplo: 20 segundos)
    's5': 15  // AJUSTADO: Duração do Novo Vídeo 4 (Exemplo: 15 segundos)
  };

  // Inicializa os players do Vimeo
  document.querySelectorAll(".slide iframe").forEach(iframe => {
    const slideClass = iframe.closest(".slide").classList[1]; // s2, s3, s4, s5...
    if (typeof Vimeo !== "undefined") {
      vimeoPlayers[slideClass] = new Vimeo.Player(iframe);
    }
  });

  function goToSlide(slideNumber) {
    clearInterval(intervalId);
    clearTimeout(intervalId); // Adicionado para garantir a limpeza do setTimeout antigo

    document.getElementById(`slide${currentSlide}`).checked = false;
    currentSlide = slideNumber;
    document.getElementById(`slide${currentSlide}`).checked = true;

    handleSlideChange();
  }

  function goToNextSlide() {
    let nextSlide = currentSlide + 1;
    if (nextSlide > totalSlides) nextSlide = 1;
    goToSlide(nextSlide);
  }

  function handleSlideChange() {
    clearInterval(intervalId);
    clearTimeout(intervalId); // Limpa resíduos de timers anteriores

    const currentClass = `s${currentSlide}`;
    const currentPlayer = vimeoPlayers[currentClass];

    // Controla o comportamento de reprodução visual de cada um
    Object.keys(vimeoPlayers).forEach(key => {
      if (key === currentClass) {
        // Se mudou para o slide do vídeo, recomeça ele do zero
        vimeoPlayers[key].setCurrentTime(0).catch(() => {});
        vimeoPlayers[key].play().catch(() => {});
      } else {
        // Pausa os vídeos que não estão na tela
        vimeoPlayers[key].pause().catch(() => {});
      }
    });

    if (currentPlayer) {
      // Se for um vídeo (s2, s3, s4 ou s5), pega o tempo definido no objeto lá em cima.
      // Se esquecer de definir algum, ele adota 10 segundos como padrão.
      const duration = (videoDurations[currentClass] || 10) * 1000; 
      
      // Passa o slide de forma garantida após o tempo de duração do vídeo acabar
      intervalId = setTimeout(goToNextSlide, duration);

    } else {
      // Se for uma imagem estática (apenas o slide s1 agora), passa após 4 segundos
      intervalId = setInterval(goToNextSlide, 4000);
    }
  }

  // Inicializa o carrossel
  setTimeout(() => {
    handleSlideChange();
  }, 200);

  // Escuta os cliques manuais nos botões redondos de baixo
  document.querySelectorAll('input[name="slide"]').forEach((input, index) => {
    input.addEventListener('change', () => {
      goToSlide(index + 1);
    });
  });
});