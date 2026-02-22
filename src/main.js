// src/main.js

import { initData, triggerAdminRestore } from './data/schedule.js';
import { initMap, updateMap, setMapFilter } from './api/map.js';
import { renderList } from './ui/render.js';
import { initSearchEvents } from './ui/search.js';

// Scroll Event for Shrinking Map
window.onscroll = function () {
    const wrapper = document.getElementById('map-wrapper');
    if (window.pageYOffset > 40) {
        wrapper.classList.add('shrink');
    } else {
        wrapper.classList.remove('shrink');
    }
};

window.onload = async function () {
    try {
        await initData(renderList, updateMap);
        initSearchEvents(renderList);

        initMap('kakao-map', '지도를 불러올 수 없습니다.')
            .then(() => {
                updateMap();
            })
            .catch(err => {
                console.error(err);
            });

        // Map Filter Buttons
        document.querySelectorAll('input[name="map-filter"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                setMapFilter(e.target.value);
                updateMap();
            });
        });

        // Admin Restore Button
        const adminBtn = document.getElementById('admin-restore-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', async () => {
                if (confirm("정말 관리자 초기 일정으로 덮어쓰시겠습니까? 모든 변경 사항이 사라집니다.")) {
                    await triggerAdminRestore(renderList, updateMap);
                }
            });
        }

    } catch (error) {
        console.error("Initialization Error", error);
    }
};
