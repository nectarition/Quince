/**
 * スマホ版でのツールチップ表示機能
 * 都道府県名をクリックすると、会場名と部屋名を表示するツールチップが表示される
 */

// ツールチップのアニメーション用スタイルをheadに追加
function injectTooltipStyles(): void {
  const styleId = 'prefecture-tooltip-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes tooltipFadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .prefecture-tooltip {
      animation: tooltipFadeIn 0.3s ease-in-out;
    }

    .prefecture-tooltip.fade-out {
      animation: tooltipFadeOut 0.3s ease-in-out forwards;
    }
  `;
  document.head.appendChild(style);
}

export function initPrefectureTooltip(): void {
  // ツールチップのスタイルを注入
  injectTooltipStyles();

  if (window.innerWidth <= 840) {
    const triggers = document.querySelectorAll('.prefecture-tooltip-trigger');

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const venue = trigger.getAttribute('data-venue');
        const room = trigger.getAttribute('data-room');

        if (!venue) return;

        // 既に表示されているツールチップを削除
        const existing = document.querySelector('.prefecture-tooltip');
        if (existing) {
          existing.remove();
        }

        // ツールチップを作成
        const tooltip = document.createElement('div');
        tooltip.className = 'prefecture-tooltip';
        tooltip.textContent = venue;

        // ツールチップのインラインスタイル
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.9em';
        tooltip.style.zIndex = '10000';
        // tooltip.style.pointerEvents = 'none';
        tooltip.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        tooltip.style.width = '200px';
        tooltip.style.lineHeight = '1.4';
        tooltip.style.whiteSpace = 'normal';
        tooltip.style.wordBreak = 'break-word';

        if (room) {
          const roomLine = document.createElement('div');
          roomLine.className = 'prefecture-tooltip-room';
          roomLine.textContent = room;
          roomLine.style.marginTop = '4px';
          roomLine.style.paddingTop = '4px';
          roomLine.style.borderTop = '1px solid rgba(255, 255, 255, 0.3)';
          roomLine.style.fontSize = '0.85em';
          tooltip.appendChild(roomLine);
        }

        document.body.appendChild(tooltip);

        // ツールチップの位置を設定
        const rect = (trigger as HTMLElement).getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 20 + 'px';
        tooltip.style.transform = 'translateX(-75%) translateY(-50%)';

        // ツールチップの外をクリックすると閉じる
        const closeTooltip = () => {
          if (tooltip && tooltip.parentNode) {
            // フェードアウトアニメーションを実行
            tooltip.classList.add('fade-out');
            // アニメーション終了後に要素を削除
            setTimeout(() => {
              if (tooltip.parentNode) {
                tooltip.remove();
              }
            }, 300); // アニメーション時間と同じ
          }
          document.removeEventListener('scroll', closeTooltip);
          document.removeEventListener('click', closeTooltip);
        };

        setTimeout(() => {
          document.addEventListener('scroll', closeTooltip);
          document.addEventListener('click', closeTooltip);
        }, 0);
      });
    });
  }
}
