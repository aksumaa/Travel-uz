import io
import logging
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

logger = logging.getLogger(__name__)

def generate_itinerary_pdf_weasyprint(itinerary_data: dict, agency_name: str = "TravelUZ Partner Agency") -> bytes:
    from weasyprint import HTML
    
    title = itinerary_data.get("title", "Custom Travel Itinerary")
    summary = itinerary_data.get("summary", "")
    total_cost = itinerary_data.get("totalCost", 0)
    days = itinerary_data.get("days", [])
    packing_tips = itinerary_data.get("packingTips", [])
    visa_info = itinerary_data.get("visaInfo", "")

    days_html = ""
    for d in days:
        day_num = d.get("day", 1)
        day_date = d.get("date", f"Day {day_num}")
        morning = d.get("morning", {})
        afternoon = d.get("afternoon", {})
        evening = d.get("evening", {})
        hotel = d.get("hotel", {})
        
        m_html = f'<tr><td class="time-col">Morning</td><td class="desc-col"><strong>{morning.get("activity", "")}</strong><br/><span class="subtext">Loc: {morning.get("location", "")} ({morning.get("duration", "")})</span></td></tr>' if morning else ''
        a_html = f'<tr><td class="time-col">Afternoon</td><td class="desc-col"><strong>{afternoon.get("activity", "")}</strong><br/><span class="subtext">Loc: {afternoon.get("location", "")} ({afternoon.get("duration", "")})</span></td></tr>' if afternoon else ''
        e_html = f'<tr><td class="time-col">Evening</td><td class="desc-col"><strong>Dining at {evening.get("restaurant", "")}</strong> ({evening.get("cuisine", "")})<br/><span class="subtext">Address: {evening.get("address", "")}</span></td></tr>' if evening else ''
        h_html = f'<tr><td class="time-col">Lodging</td><td class="desc-col"><strong>{hotel.get("name", "")}</strong> ({hotel.get("stars", 4)}★) — ${hotel.get("price", 0)}/night</td></tr>' if hotel else ''

        days_html += f"""
        <div class="day-card">
            <h3 class="day-title">{day_date}</h3>
            <table class="schedule-table">
                {m_html}
                {a_html}
                {e_html}
                {h_html}
            </table>
        </div>
        """

    tips_html = ""
    if packing_tips:
        tips_items = "".join(f"<li>{tip}</li>" for tip in packing_tips)
        tips_html = f"""
        <div class="section">
            <h4>Essential Travel & Packing Tips</h4>
            <ul>{tips_items}</ul>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>{title}</title>
        <style>
            @page {{
                size: A4;
                margin: 20mm;
            }}
            body {{
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #1e293b;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }}
            .header {{
                border-bottom: 3px solid #0284c7;
                padding-bottom: 12px;
                margin-bottom: 20px;
            }}
            .agency-name {{
                font-size: 20pt;
                font-weight: bold;
                color: #0f172a;
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            .doc-subtitle {{
                font-size: 10pt;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }}
            .trip-title {{
                font-size: 18pt;
                font-weight: bold;
                color: #0284c7;
                margin-top: 15px;
                margin-bottom: 5px;
            }}
            .summary {{
                font-size: 11pt;
                color: #334155;
                margin-bottom: 15px;
            }}
            .meta-badge {{
                display: inline-block;
                background-color: #e0f2fe;
                color: #0369a1;
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 11pt;
                margin-bottom: 20px;
            }}
            .day-card {{
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 16px;
                page-break-inside: avoid;
            }}
            .day-title {{
                font-size: 13pt;
                color: #0369a1;
                margin-top: 0;
                margin-bottom: 10px;
                border-bottom: 1px solid #cbd5e1;
                padding-bottom: 4px;
            }}
            .schedule-table {{
                width: 100%;
                border-collapse: collapse;
            }}
            .schedule-table td {{
                padding: 6px 4px;
                vertical-align: top;
                font-size: 10pt;
            }}
            .time-col {{
                width: 22%;
                font-weight: bold;
                color: #0f172a;
            }}
            .desc-col {{
                width: 78%;
            }}
            .subtext {{
                color: #64748b;
                font-size: 9pt;
            }}
            .section {{
                margin-top: 20px;
                page-break-inside: avoid;
            }}
            h4 {{
                font-size: 11pt;
                color: #0f172a;
                margin-bottom: 6px;
            }}
            ul {{
                margin: 0;
                padding-left: 20px;
                font-size: 10pt;
            }}
            li {{
                margin-bottom: 4px;
            }}
            .footer {{
                margin-top: 30px;
                border-top: 1px solid #cbd5e1;
                padding-top: 10px;
                font-size: 9pt;
                color: #94a3b8;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="agency-name">{agency_name}</div>
            <div class="doc-subtitle">Official Branded Travel Itinerary</div>
        </div>

        <div class="trip-title">{title}</div>
        {f'<div class="summary">{summary}</div>' if summary else ''}
        <div class="meta-badge">Estimated Budget: ${total_cost:,.2f}</div>

        {days_html}

        {tips_html}

        {f'<div class="section"><h4>Visa & Entry Requirements</h4><p style="font-size:10pt;">{visa_info}</p></div>' if visa_info else ''}

        <div class="footer">
            Generated by {agency_name} via TravelUZ B2B SaaS Platform.
        </div>
    </body>
    </html>
    """

    return HTML(string=html_content).write_pdf()

def generate_itinerary_pdf_reportlab(itinerary_data: dict, agency_name: str = "TravelUZ Partner Agency") -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    header_style = ParagraphStyle(
        'AgencyHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a")
    )
    
    title_style = ParagraphStyle(
        'TripTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0284c7")
    )

    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569")
    )

    day_header_style = ParagraphStyle(
        'DayHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0369a1")
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b")
    )

    bold_label_style = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0f172a")
    )

    elements = []

    # Agency Header Bar
    elements.append(Paragraph(f"<b>{agency_name.upper()}</b>", header_style))
    elements.append(Paragraph("OFFICIAL BRANDED TRAVEL ITINERARY", subtitle_style))
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0284c7"), spaceAfter=15))

    # Itinerary Title & Summary
    title = itinerary_data.get("title", "Custom Travel Itinerary")
    summary = itinerary_data.get("summary", "")
    total_cost = itinerary_data.get("totalCost", 0)

    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 5))
    if summary:
        elements.append(Paragraph(summary, body_style))
        elements.append(Spacer(1, 8))
    
    elements.append(Paragraph(f"<b>Estimated Total Budget:</b> ${total_cost:,.2f}", bold_label_style))
    elements.append(Spacer(1, 15))

    # Days Schedule
    days = itinerary_data.get("days", [])
    for d in days:
        day_num = d.get("day", 1)
        day_date = d.get("date", f"Day {day_num}")
        elements.append(Paragraph(f"<b>{day_date}</b>", day_header_style))
        elements.append(Spacer(1, 5))

        table_data = []

        morning = d.get("morning", {})
        if morning:
            table_data.append([
                Paragraph("<b>Morning</b>", bold_label_style),
                Paragraph(f"{morning.get('activity', '')}<br/><font color='#64748b'>Loc: {morning.get('location', '')} ({morning.get('duration', '')})</font>", body_style)
            ])

        afternoon = d.get("afternoon", {})
        if afternoon:
            table_data.append([
                Paragraph("<b>Afternoon</b>", bold_label_style),
                Paragraph(f"{afternoon.get('activity', '')}<br/><font color='#64748b'>Loc: {afternoon.get('location', '')} ({afternoon.get('duration', '')})</font>", body_style)
            ])

        evening = d.get("evening", {})
        if evening:
            table_data.append([
                Paragraph("<b>Evening</b>", bold_label_style),
                Paragraph(f"Dining at {evening.get('restaurant', '')} ({evening.get('cuisine', '')})<br/><font color='#64748b'>Address: {evening.get('address', '')}</font>", body_style)
            ])

        hotel = d.get("hotel", {})
        if hotel:
            table_data.append([
                Paragraph("<b>Lodging</b>", bold_label_style),
                Paragraph(f"{hotel.get('name', '')} ({hotel.get('stars', 4)}★) - ${hotel.get('price', 0)}/night", body_style)
            ])

        if table_data:
            t = Table(table_data, colWidths=[90, 450])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 12))

    # Packing Tips & Additional Info
    tips = itinerary_data.get("packingTips", [])
    if tips:
        elements.append(Paragraph("<b>Essential Travel & Packing Tips:</b>", bold_label_style))
        for tip in tips:
            elements.append(Paragraph(f"• {tip}", body_style))
        elements.append(Spacer(1, 10))

    visa = itinerary_data.get("visaInfo")
    if visa:
        elements.append(Paragraph(f"<b>Visa & Entry Requirements:</b> {visa}", body_style))
        elements.append(Spacer(1, 10))

    # Footer
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=15, spaceAfter=10))
    elements.append(Paragraph(f"Generated by {agency_name} via TravelUZ B2B SaaS Platform. All rights reserved.", subtitle_style))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def generate_itinerary_pdf(itinerary_data: dict, agency_name: str = "TravelUZ Partner Agency") -> bytes:
    try:
        return generate_itinerary_pdf_weasyprint(itinerary_data, agency_name)
    except Exception as e:
        logger.warning(f"WeasyPrint PDF generation unavailable or failed ({e}), using ReportLab fallback.")
        return generate_itinerary_pdf_reportlab(itinerary_data, agency_name)
