
setTimeout(() => {
  animation();
}, 250);

export function animation(){
    anime({
      targets: '.items',
      translateY: -10,
      opacity: 1,
      easing: 'easeOutInExpo',
      delay: anime.stagger(50),
      duraction: 1000, 
    })
}
