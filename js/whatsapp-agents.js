"use strict";

/* pieza-whatsapp-interactivo-v1: config central de industrias/agentes */
(function () {
  var industries = {
    turismo: {
      id: "turismo",
      label: "Turismo",
      agentName: "Vale · Turismo IA",
      agentLetter: "T",
      agentColor: "#25d366",
      description: "Cotizaciones, reservas y seguimiento de viajeros 24/7.",
      features: [
        "Responde disponibilidad y precios por temporada",
        "Califica intención de compra y deriva al ejecutivo",
        "Automatiza seguimiento post-cotización",
      ],
      welcome:
        "Hola, soy Vale de Turismo IA. Te ayudo con cotizaciones, reservas y consultas de viaje.",
      demoReplies: [
        "Perfecto, puedo ayudarte con esa ruta. ¿Qué fechas y cantidad de pasajeros tienes en mente?",
        "Te propongo dos opciones con y sin equipaje incluido. ¿Prefieres vuelo directo?",
        "Listo, te dejo una pre-reserva por 24 horas mientras validamos disponibilidad final.",
      ],
    },
    retail: {
      id: "retail",
      label: "Retail",
      agentName: "Mati · Retail IA",
      agentLetter: "R",
      agentColor: "#128c7e",
      description: "Stock, ventas y postventa conectadas por WhatsApp.",
      features: [
        "Consulta stock y disponibilidad en tiempo real",
        "Comparte links de pago y estado de pedido",
        "Resuelve cambios y devoluciones frecuentes",
      ],
      welcome:
        "Hola, soy Mati de Retail IA. Te apoyo con stock, compras y postventa en minutos.",
      demoReplies: [
        "Sí, tenemos disponibilidad. ¿Te lo dejo con despacho a domicilio o retiro en tienda?",
        "Puedo enviarte el link de pago ahora mismo. ¿Quieres boleta o factura?",
        "Te comparto el estado del pedido y una alternativa por si buscas entrega más rápida.",
      ],
    },
    agroalimentos: {
      id: "agroalimentos",
      label: "Agroalimentos",
      agentName: "Cami · Agro IA",
      agentLetter: "A",
      agentColor: "#075e54",
      description: "Pedidos mayoristas, trazabilidad y coordinación logística.",
      features: [
        "Gestiona pedidos por volumen y frecuencia",
        "Informa trazabilidad y ventanas de despacho",
        "Automatiza reposición con clientes recurrentes",
      ],
      welcome:
        "Hola, soy Cami de Agro IA. Te ayudo con pedidos, trazabilidad y logística comercial.",
      demoReplies: [
        "Entendido. Para ese volumen, puedo proponerte despacho parcial o consolidado.",
        "La trazabilidad está al día. ¿Te envío resumen por lote o por guía de despacho?",
        "Puedo programar reposición semanal automática según tu histórico de consumo.",
      ],
    },
    servicios: {
      id: "servicios",
      label: "Servicios",
      agentName: "Diego · Servicios IA",
      agentLetter: "S",
      agentColor: "#34b7f1",
      description: "Agenda, soporte y seguimiento operativo sin fricción.",
      features: [
        "Agenda visitas técnicas en una conversación",
        "Clasifica urgencia y deriva al equipo correcto",
        "Envía recordatorios y cierre de tickets",
      ],
      welcome:
        "Hola, soy Diego de Servicios IA. Coordinemos tu solicitud y la dejamos resuelta.",
      demoReplies: [
        "Gracias por el contexto. Puedo agendar una visita técnica hoy en la tarde o mañana AM.",
        "Para acelerar la atención, ¿me confirmas comuna y franja horaria disponible?",
        "Listo, ticket creado y derivado. Te aviso por este mismo chat cuando se asigne técnico.",
      ],
    },
    salud: {
      id: "salud",
      label: "Salud",
      agentName: "Paula · Salud IA",
      agentLetter: "H",
      agentColor: "#00a884",
      description: "Agenda médica, recordatorios y orientación inicial.",
      features: [
        "Agenda y confirma horas automáticamente",
        "Envía recordatorios para reducir ausencias",
        "Filtra consultas y orienta al canal adecuado",
      ],
      welcome:
        "Hola, soy Paula de Salud IA. Te ayudo a agendar, confirmar y orientar tu consulta.",
      demoReplies: [
        "Puedo ofrecerte hora hoy a las 18:30 o mañana a las 09:00. ¿Cuál prefieres?",
        "Perfecto, agendado. Te enviaré un recordatorio antes de la cita.",
        "Para orientarte mejor, ¿es primera consulta o control?",
      ],
    },
  };

  window.DanaWhatsAppAgents = {
    pieceName: "pieza-whatsapp-interactivo-v1",
    industries: industries,
    defaultIndustry: "turismo",
  };
})();
