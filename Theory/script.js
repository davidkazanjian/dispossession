const observer = new IntersectionObserver(entries => {

    entries.forEach(({ target, isIntersecting }) => {

        if (!isIntersecting) return;

        document
            .querySelectorAll("#nav-theory a")
            .forEach(link => link.classList.remove("active"));

        document
            .querySelector(`#nav-theory a[href="#${target.id}"]`)
            ?.classList.add("active");

    });

}, {
    threshold: 0.45
});

document
    .querySelectorAll("#section-theory .card[id]")
    .forEach(card => observer.observe(card));
