/**
 * Video-Audio Synchronization
 * Jednoduchý kód pro synchronizaci videa, audia a titulků
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM načten, inicializuji synchronizaci videa a audia');
    
    // Získání elementů
    const video = document.getElementById('aboutVideo');
    const audio = document.getElementById('videoAudio');
    
    // Kontrola existence elementů
    if (!video) {
        console.error('Video element nenalezen!');
        return;
    }
    
    console.log('Video element nalezen');
    
    // Nastavení výchozích hodnot
    let videoWasVisible = false;
    
    // Funkce pro kontrolu viditelnosti elementu
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    }
    
    // Funkce pro spuštění videa a audia od začátku
    function startFromBeginning() {
        console.log('Spuštím video a audio od začátku');
        
        // Resetování na začátek
        video.currentTime = 0;
        
        // Spuštění videa
        video.play().then(() => {
            console.log('Video úspěšně spuštěno');
            
            // Pokud existuje audio, resetujeme ho a spuštíme
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.error('Chyba při spuštění audia:', e));
            }
        }).catch(e => console.error('Chyba při spuštění videa:', e));
    }
    
    // Funkce pro zastavení videa a audia
    function stopPlayback() {
        console.log('Zastavuji přehrávání');
        
        // Zastavení videa
        if (!video.paused) {
            video.pause();
        }
        
        // Zastavení audia
        if (audio && !audio.paused) {
            audio.pause();
        }
    }
    
    // Základní synchronizace videa a audia
    if (audio) {
        console.log('Audio element nalezen, nastavuji synchronizaci');
        
        // Nastavení výchozí hlasitosti
        audio.volume = 0.7;
        
        // Synchronizace při přehrávání
        video.addEventListener('play', function() {
            if (audio.paused) {
                audio.currentTime = video.currentTime;
                audio.play().catch(e => console.error('Chyba při přehrávání audia:', e));
            }
        });
        
        // Synchronizace při pozastavení
        video.addEventListener('pause', function() {
            if (!audio.paused) {
                audio.pause();
            }
        });
        
        // Synchronizace při posunu
        video.addEventListener('seeked', function() {
            audio.currentTime = video.currentTime;
        });
        
        // Synchronizace při ukončení
        video.addEventListener('ended', function() {
            if (video.loop) {
                audio.currentTime = 0;
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }
    
    // Kontrola scrollování
    window.addEventListener('scroll', function() {
        const isVisible = isElementInViewport(video);
        
        if (isVisible && !videoWasVisible) {
            // Video se právě stalo viditelným
            videoWasVisible = true;
            startFromBeginning();
        } 
        else if (!isVisible && videoWasVisible) {
            // Video právě zmizelo z dohledu
            videoWasVisible = false;
            stopPlayback();
        }
    });
    
    // Kontrola viditelnosti při načtení stránky
    setTimeout(function() {
        const isVisible = isElementInViewport(video);
        console.log('Kontrola viditelnosti při načtení:', isVisible ? 'Viditelné' : 'Neviditelné');
        
        if (isVisible) {
            videoWasVisible = true;
            startFromBeginning();
        }
    }, 1000);
    
    // Pravidelná kontrola synchronizace
    setInterval(function() {
        if (!video.paused && audio && !audio.paused) {
            if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
                console.log('Korekce synchronizace');
                audio.currentTime = video.currentTime;
            }
        }
    }, 2000);
    
    // Přidáme ovládací prvky až po inicializaci přehrávání
    setTimeout(function() {
        // Přidání moderních ovládacích prvků pro zvuk v zelené barvě
        if (audio) {
            try {
                const videoContainer = video.parentElement;
                if (!videoContainer) {
                    console.error('Nelze najít container videa');
                    return;
                }
                
                // Kontrola, zda již ovládací prvky neexistují
                if (document.querySelector('.rti-audio-controls')) {
                    return;
                }
                
                // Vytvoření ovládacích prvků
                const audioControls = document.createElement('div');
                audioControls.className = 'rti-audio-controls';
                audioControls.innerHTML = `
                    <button id="toggleAudio" class="rti-audio-toggle">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <div class="rti-volume-slider-container">
                        <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="0.7" class="rti-volume-slider">
                    </div>
                `;
                
                videoContainer.appendChild(audioControls);
                
                // Stylování ovládacích prvků
                if (!document.getElementById('rti-audio-controls-style')) {
                    const style = document.createElement('style');
                    style.id = 'rti-audio-controls-style';
                    style.textContent = `
                        .rti-audio-controls {
                            position: absolute;
                            bottom: 15px;
                            right: 15px;
                            display: flex;
                            align-items: center;
                            background-color: rgba(0, 0, 0, 0.6);
                            padding: 8px 12px;
                            border-radius: 30px;
                            z-index: 10;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                            transition: all 0.3s ease;
                            pointer-events: auto;
                        }
                        
                        .rti-audio-controls:hover {
                            background-color: rgba(0, 0, 0, 0.8);
                        }
                        
                        .rti-audio-toggle {
                            background: none;
                            border: none;
                            color: #07ff01;
                            cursor: pointer;
                            font-size: 18px;
                            padding: 5px;
                            transition: all 0.2s ease;
                            outline: none;
                        }
                        
                        .rti-audio-toggle:hover {
                            transform: scale(1.1);
                            color: #00ff00;
                        }
                        
                        .rti-volume-slider-container {
                            position: relative;
                            margin-left: 10px;
                            width: 80px;
                        }
                        
                        .rti-volume-slider {
                            -webkit-appearance: none;
                            width: 100%;
                            height: 4px;
                            border-radius: 2px;
                            background: #444;
                            outline: none;
                            cursor: pointer;
                        }
                        
                        .rti-volume-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            background: #07ff01;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }
                        
                        .rti-volume-slider::-webkit-slider-thumb:hover {
                            background: #00ff00;
                            transform: scale(1.2);
                        }
                        
                        .rti-volume-slider::-moz-range-thumb {
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            background: #07ff01;
                            cursor: pointer;
                            border: none;
                            transition: all 0.2s ease;
                        }
                        
                        .rti-volume-slider::-moz-range-thumb:hover {
                            background: #00ff00;
                            transform: scale(1.2);
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Ovládání zvuku
                const toggleAudio = document.getElementById('toggleAudio');
                const volumeSlider = document.getElementById('volumeSlider');
                
                if (toggleAudio && volumeSlider) {
                    // Zabráníme bublajícím událostem, které by mohly ovlivnit přehrávání
                    audioControls.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                    
                    toggleAudio.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (audio.muted) {
                            audio.muted = false;
                            toggleAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
                        } else {
                            audio.muted = true;
                            toggleAudio.innerHTML = '<i class="fas fa-volume-mute"></i>';
                        }
                    });
                    
                    volumeSlider.addEventListener('input', function(e) {
                        e.stopPropagation();
                        audio.volume = this.value;
                        if (parseFloat(this.value) === 0) {
                            toggleAudio.innerHTML = '<i class="fas fa-volume-mute"></i>';
                        } else if (parseFloat(this.value) < 0.5) {
                            toggleAudio.innerHTML = '<i class="fas fa-volume-down"></i>';
                        } else {
                            toggleAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
                        }
                    });
                    
                    // Výchozí hlasitost
                    audio.volume = 0.7;
                    volumeSlider.value = 0.7;
                }
            } catch (error) {
                console.error('Chyba při vytváření ovládacích prvků:', error);
            }
        }
    }, 2000); // Zpoždění pro jistotu, že video už bude inicializováno
});
