<!--
  DragonBackground.svelte
  Renders a large diagonal Chinese dragon SVG across the viewport
  at low opacity (~4.5%) for the light theme.

  Head at top-right, tail curling to bottom-left.
  Includes spine ridges, claws, scales, and tail flame wisps.

  NOTE: This is a placeholder SVG. Replace with commissioned artwork
  for production. The opacity and positioning will carry over — just
  swap the <svg> content for an <img> or more detailed SVG.
-->
<div class="dragon-bg" aria-hidden="true">
    <svg viewBox="0 0 1200 900" class="dragon-svg">
        <defs>
            <linearGradient id="dragon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#C41E3A" />
                <stop offset="50%" stop-color="#8B1538" />
                <stop offset="100%" stop-color="#C41E3A" />
            </linearGradient>
        </defs>

        <!-- Dragon body — flowing S-curve -->
        <path
            d="M950 80 C920 60 900 40 870 50 C840 60 860 90 880 100 C900 110 910 90 920 80
			   C930 70 940 85 935 95 C925 120 890 140 860 150 C820 170 780 130 750 160
			   C720 190 700 230 680 260 C660 290 620 280 590 310 C560 340 540 380 510 400
			   C480 420 450 410 430 440 C410 470 380 490 350 520 C320 550 290 540 270 570
			   C250 600 220 630 200 660 C180 690 160 720 150 750 C140 780 120 800 110 830"
            fill="none"
            stroke="url(#dragon-grad)"
            stroke-width="28"
            stroke-linecap="round"
        />

        <!-- Secondary body line -->
        <path
            d="M950 80 C940 110 910 130 880 140 C850 155 825 135 800 155
			   C775 175 755 200 730 220 C705 240 680 235 660 255 C635 280 615 300 590 315"
            fill="none"
            stroke="url(#dragon-grad)"
            stroke-width="22"
            stroke-linecap="round"
            opacity="0.6"
        />

        <!-- Head -->
        <circle cx="960" cy="65" r="8" fill="#C41E3A" opacity="0.8" />
        <circle cx="945" cy="58" r="5" fill="#C41E3A" opacity="0.6" />

        <!-- Whiskers / horns -->
        <path
            d="M970 55 C985 35 990 25 1000 20"
            fill="none"
            stroke="#C41E3A"
            stroke-width="4"
            stroke-linecap="round"
            opacity="0.7"
        />
        <path
            d="M965 48 C975 30 985 22 990 15"
            fill="none"
            stroke="#C41E3A"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.5"
        />

        <!-- Spine ridges -->
        {#each Array.from({ length: 13 }, (_, i) => i) as i}
            {@const t = i / 12}
            {@const cx = 950 - t * 840}
            {@const cy = 80 + t * 750 + Math.sin(t * Math.PI * 3) * 30}
            <path
                d="M{cx} {cy - 15} C{cx + 8} {cy - 30} {cx + 12} {cy - 35} {cx + 5} {cy - 40}"
                fill="none"
                stroke="#C41E3A"
                stroke-width="3"
                stroke-linecap="round"
                opacity={0.3 + t * 0.2}
            />
        {/each}

        <!-- Claws / legs -->
        <path
            d="M830 145 C815 165 800 175 790 185"
            fill="none"
            stroke="#C41E3A"
            stroke-width="8"
            stroke-linecap="round"
            opacity="0.5"
        />
        <path
            d="M790 185 L780 195 M790 185 L795 198 M790 185 L785 200"
            fill="none"
            stroke="#C41E3A"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.4"
        />

        <path
            d="M620 290 C605 310 590 325 580 335"
            fill="none"
            stroke="#C41E3A"
            stroke-width="8"
            stroke-linecap="round"
            opacity="0.5"
        />
        <path
            d="M580 335 L570 345 M580 335 L585 348 M580 335 L575 350"
            fill="none"
            stroke="#C41E3A"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.4"
        />

        <path
            d="M390 460 C375 480 360 495 350 505"
            fill="none"
            stroke="#C41E3A"
            stroke-width="7"
            stroke-linecap="round"
            opacity="0.4"
        />
        <path
            d="M230 610 C215 630 200 645 190 655"
            fill="none"
            stroke="#C41E3A"
            stroke-width="6"
            stroke-linecap="round"
            opacity="0.3"
        />

        <!-- Tail flame wisps -->
        <path
            d="M110 830 C95 850 80 860 60 855"
            fill="none"
            stroke="#C41E3A"
            stroke-width="10"
            stroke-linecap="round"
            opacity="0.5"
        />
        <path
            d="M60 855 C40 850 25 860 15 870"
            fill="none"
            stroke="#C41E3A"
            stroke-width="6"
            stroke-linecap="round"
            opacity="0.3"
        />
        <path
            d="M60 855 C45 865 35 880 30 890"
            fill="none"
            stroke="#C41E3A"
            stroke-width="4"
            stroke-linecap="round"
            opacity="0.2"
        />

        <!-- Scale patterns -->
        {#each Array.from({ length: 9 }, (_, i) => i) as i}
            {@const t = (i + 1) / 10}
            {@const cx = 940 - t * 830}
            {@const cy = 85 + t * 740 + Math.sin(t * Math.PI * 3) * 25}
            <g opacity="0.15">
                <path
                    d="M{cx - 12} {cy} A6 6 0 0 1 {cx} {cy - 8} A6 6 0 0 1 {cx + 12} {cy}"
                    fill="none"
                    stroke="#C41E3A"
                    stroke-width="1.5"
                />
                <path
                    d="M{cx - 8} {cy + 5} A4 4 0 0 1 {cx} {cy} A4 4 0 0 1 {cx + 8} {cy + 5}"
                    fill="none"
                    stroke="#C41E3A"
                    stroke-width="1.5"
                />
            </g>
        {/each}
    </svg>

    <!-- Warm gradient overlays -->
    <div class="glow glow-top" />
    <div class="glow glow-bottom" />
</div>

<style>
    .dragon-bg {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    }

    .dragon-svg {
        position: absolute;
        top: -5%;
        right: -10%;
        width: 110%;
        height: 110%;
        opacity: 0.045;
        transform: rotate(-15deg);
    }

    .glow {
        position: absolute;
        width: 50%;
        height: 40%;
    }

    .glow-top {
        top: 0;
        right: 0;
        background: radial-gradient(ellipse at 80% 20%, rgba(196, 30, 58, 0.04), transparent 60%);
    }

    .glow-bottom {
        bottom: 0;
        left: 0;
        background: radial-gradient(ellipse at 20% 80%, rgba(196, 30, 58, 0.03), transparent 60%);
    }
</style>
