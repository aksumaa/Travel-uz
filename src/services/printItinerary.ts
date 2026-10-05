type DayBlock = {
  day?: number;
  morning?: { activity?: string; location?: string };
  afternoon?: { activity?: string; location?: string };
  evening?: { restaurant?: string; cuisine?: string; address?: string };
  hotel?: { name?: string; area?: string; stars?: number; price?: number };
};

export function openItineraryPrint(title: string, summary: string, days: DayBlock[] = []) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const body = days.map((day) => `
    <section>
      <h2>Day ${day.day || ''}</h2>
      <p><strong>Morning:</strong> ${day.morning?.activity || ''} — ${day.morning?.location || ''}</p>
      <p><strong>Afternoon:</strong> ${day.afternoon?.activity || ''} — ${day.afternoon?.location || ''}</p>
      <p><strong>Evening:</strong> ${day.evening?.restaurant || ''} (${day.evening?.cuisine || ''}) ${day.evening?.address || ''}</p>
      <p><strong>Stay:</strong> ${day.hotel?.name || ''} ${day.hotel?.stars ? `(${day.hotel.stars}★)` : ''} ${day.hotel?.area || ''}</p>
    </section>
  `).join('');

  printWindow.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      body { font-family: Georgia, sans-serif; padding: 32px; color: #0f172a; }
      h1 { margin-bottom: 8px; }
      section { margin: 20px 0; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    </style></head><body>
    <h1>${title}</h1>
    <p>${summary || ''}</p>
    ${body}
    </body></html>`);
  printWindow.document.close();
  printWindow.print();
}
