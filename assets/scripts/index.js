document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 1;
  const totalSlides = 5;
  let intervalId;
  const vimeoPlayers = {}; // Armazena as instâncias dos players do Vimeo

  // Inicializa os players do Vimeo que estão na página
  document.querySelectorAll(".slide iframe").forEach(iframe => {
    const slideClass = iframe.closest(".slide").classList[1]; // Pega 's2', 's3', etc.
    if (typeof Vimeo !== "undefined") {
      vimeoPlayers[slideClass] = new Vimeo.Player(iframe);
    }
  });

  function goToSlide(slideNumber) {
    clearInterval(intervalId);

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
    // 1. Pausa TODOS os vídeos do Vimeo antes de focar no atual
    Object.values(vimeoPlayers).forEach(player => {
      player.pause().catch(() => {});
      player.setCurrentTime(0).catch(() => {});
      player.off("ended"); // Remove ouvintes antigos para não duplicar gatilhos
    });

    const currentClass = `s${currentSlide}`;
    const currentPlayer = vimeoPlayers[currentClass];

    // 2. Se o slide atual tiver um vídeo do Vimeo
    if (currentPlayer) {
      clearInterval(intervalId); // Para o contador de tempo (o vídeo assume o controle)

      currentPlayer.setMuted(true);
      currentPlayer.setCurrentTime(0);
      
      currentPlayer.play()
        .then(() => {
          // Quando o vídeo do Vimeo terminar, avança para o próximo slide
          currentPlayer.on("ended", () => {
            goToNextSlide();
          });
        })
        .catch(err => {
          console.log("Erro ao reproduzir player do Vimeo:", err);
          // Se houver bloqueio do navegador, passa em 4 segundos para não travar o slider
          setTimeout(goToNextSlide, 4000);
        });

    } else {
      // 3. Se for uma imagem estática, passa após 4 segundos
      intervalId = setInterval(goToNextSlide, 4000);
    }
  }

  // Inicializa o primeiro slide
  setTimeout(() => {
    handleSlideChange();
  }, 200);

  // Ouvinte para a navegação manual pelos botões (Labels / Inputs Radio)
  document.querySelectorAll('input[name="slide"]').forEach((input, index) => {
    input.addEventListener('change', () => {
      goToSlide(index + 1);
    });
  });
});