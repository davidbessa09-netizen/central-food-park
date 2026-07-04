import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

// Single source of truth for the business's WhatsApp number — used for the
// PIX confirmation text, the "Falar com Atendente" link, and the
// new-reservation notification copy sent from the booking success screen.
const BUSINESS_WHATSAPP = "(48) 99653-1583";

// ── DATA ────────────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: 1,
    slug: "gratuito-seg-qui",
    name: "Aniversário Gratuito — Seg a Qui",
    emoji: "🎂",
    horario: "A partir das 18h",
    valor: null,
    valorNum: 0,
    tag: "GRATUITO",
    color: "#F59E0B",
    bg: "#FFFBEB",
    capacity: "Sem limite fixo",
    includes: [
      "Espaço reservado no Food Park",
      "Pode trazer bolo",
      "Pode trazer docinhos",
      "Pode trazer decoração",
      "🅿️ Estacionamento gratuito",
    ],
    kit: [
      "🎈 1 Kit Balão decorativo",
      "🍺 1 Voucher Torre de Chopp 2L",
      "🍹 1 Voucher Drink à sua escolha",
      "🎱 Voucher Sinuca livre",
      "🥤 1 Copo personalizado do Central",
      "🍰 1 Fatia de Torta Banoffee",
      "🏷️ Voucher 10% de desconto nos Food Trucks: Butiquim do Chef, Salita Pizza, Nikô Sushi, King's Chicken, Dom Florêncio, Batata Trevs",
    ],
    rules: [
      "❌ Proibido trazer bebidas",
      "❌ Proibido trazer salgados",
      "🍽️ Consumo somente nas operações do Food Park",
      "📅 Válido de segunda a quinta-feira",
      "👥 Mínimo de 9 convidados para ativar o pacote",
      "🎠 Se o aniversariante for criança, Área Kids interna gratuita!",
    ],
    bring: [],
    kids: null,
    description: "Comemore no espaço do Food Park sem custo. Mínimo de 9 convidados. Disponível de segunda a quinta-feira.",
  },
  {
    id: 6,
    slug: "gratuito-sex-dom",
    name: "Aniversário Gratuito — Sex a Dom",
    emoji: "🎉",
    horario: "A partir das 18h",
    valor: null,
    valorNum: 0,
    tag: "GRATUITO",
    color: "#F97316",
    bg: "#FFF7ED",
    capacity: "Sem limite fixo",
    includes: [
      "Espaço reservado no Food Park",
      "Pode trazer bolo",
      "Pode trazer docinhos",
      "Pode trazer decoração",
      "🅿️ Estacionamento gratuito",
    ],
    kit: [
      "🎠 2 entradas na Área Kids",
      "🍺 1 Torre de Chopp 2L",
      "👥 Válido ao levar mínimo 9 convidados",
    ],
    rules: [
      "❌ Proibido trazer bebidas",
      "❌ Proibido trazer salgados",
      "🍽️ Consumo somente nas operações do Food Park",
      "📅 Válido de sexta-feira a domingo",
    ],
    bring: [],
    kids: null,
    description: "Comemore no espaço do Food Park sem custo. Mínimo de 9 convidados. Disponível de sexta-feira a domingo.",
  },
  {
    id: 7,
    slug: "gratuito-kids",
    name: "Aniversário Gratuito Infantil",
    emoji: "🧒",
    horario: "A partir das 18h",
    valor: null,
    valorNum: 0,
    tag: "GRATUITO",
    color: "#06B6D4",
    bg: "#ECFEFF",
    capacity: "Sem limite fixo",
    includes: [
      "Espaço reservado no Food Park",
      "Pode trazer bolo",
      "Pode trazer docinhos",
      "Pode trazer decoração",
      "🅿️ Estacionamento gratuito",
    ],
    kit: [
      "🎠 2 entradas na Área Kids",
      "🍺 1 Torre de Chopp 2L para os pais",
      "🧃 1 Drink Kids à escolha",
      "👥 Válido ao levar mínimo 9 convidados",
    ],
    rules: [
      "❌ Proibido trazer bebidas",
      "❌ Proibido trazer salgados",
      "🍽️ Consumo somente nas operações do Food Park",
      "📅 Válido qualquer dia da semana",
    ],
    bring: [],
    kids: null,
    description: "Comemore com os pequenos no Food Park sem custo, com entradas na Área Kids e mimo especial para os pais!",
  },
  {
    id: 8,
    slug: "reserva-diversas",
    name: "Reserva Gratuita Diversas",
    emoji: "🪑",
    horario: "A partir das 18h",
    valor: null,
    valorNum: 0,
    tag: "GRATUITO",
    color: "#14B8A6",
    bg: "#F0FDFA",
    capacity: "Conforme espaço escolhido",
    includes: [
      "Espaço reservado no Food Park",
      "🅿️ Estacionamento gratuito",
    ],
    kit: [
      "🎠 2 entradas na Área Kids",
      "🍺 1 Torre de Chopp 2L",
      "👥 Válido ao levar mínimo 9 convidados",
    ],
    rules: [
      "❌ Proibido trazer bebidas",
      "❌ Proibido trazer salgados",
      "🍽️ Consumo somente nas operações do Food Park",
      "📅 Válido qualquer dia da semana",
    ],
    bring: [],
    kids: null,
    description: "Reserve sua mesa para grupos e reuniões diversas no Food Park, sem custo e qualquer dia da semana.",
  },
  {
    id: 2,
    slug: "infantil-fp",
    name: "Aniversário Infantil Food Park",
    emoji: "🎈",
    horario: "Das 15h às 19h",
    valor: "R$ 980,00",
    valorNum: 980,
    tag: "ATÉ 40 PESSOAS",
    color: "#EC4899",
    bg: "#FDF2F8",
    capacity: "Até 40 pessoas (+R$20/convidado extra)",
    includes: [
      "Espaço para festa infantil",
      "Área Kids com monitoria",
      "Água, Refrigerante e Suco",
      "🍺 Bar aberto e funcionando durante toda a festa",
      "🅿️ Estacionamento gratuito",
    ],
    bring: ["Decoração", "Bolo", "Docinhos", "Salgados"],
    rules: [],
    kids: null,
    description: "Festa infantil com área kids supervisionada. Bebidas inclusas.",
  },
  {
    id: 3,
    slug: "churrasqueira",
    name: "Churrasqueira Premium",
    emoji: "🔥",
    horario: "Das 9h às 23h",
    valor: "R$ 500,00",
    valorNum: 500,
    tag: "ATÉ 100 PESSOAS",
    color: "#EF4444",
    bg: "#FEF2F2",
    capacity: "100 pessoas no total (60 coberto + 40 área externa)",
    includes: [
      "Quadra de areia",
      "Sinuca",
      "Churrasqueira interna e externa",
      "Mesas/cadeiras p/ 60 pessoas na área coberta",
      "Área externa descoberta p/ 40 pessoas",
      "Geladeira, Cervejeira, Fogão",
      "Pia de mármore, Micro-ondas",
      "Gás, Espetos e Grelha",
      "🅿️ Estacionamento gratuito",
    ],
    bring: ["Comidas", "Bebidas", "Decoração"],
    rules: ["🔊 Somente som mecânico ambiente", "❌ Proibido música ao vivo"],
    kids: null,
    description: "Estrutura completa para churrasco com quadra, sinuca e até 100 pessoas.",
  },
  {
    id: 4,
    slug: "churras-kids",
    name: "Churrasqueira + Área Kids",
    emoji: "🏆",
    horario: "Das 9h às 23h",
    valor: "R$ 950,00",
    valorNum: 950,
    tag: "ATÉ 20 CRIANÇAS",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    capacity: "100 pessoas + até 20 crianças inclusas",
    includes: [
      "Tudo do Pacote Churrasqueira Premium",
      "Área Kids com monitoria (até 20 crianças inclusas no pacote)",
      "🎠 Após as 18h a Área Kids abre para todas as crianças clientes do park",
      "🅿️ Estacionamento gratuito",
    ],
    bring: ["Comidas", "Bebidas", "Decoração"],
    rules: ["🔊 Somente som mecânico ambiente", "❌ Proibido música ao vivo"],
    kids: ["Tobogã inflável","Basquete","Chute a gol","Pebolim","Disco Air Soft","Circuito Brinquedão","Fliperama","Pneu Pula","TV"],
    description: "A churrasqueira completa mais diversão garantida para as crianças.",
  },
  {
    id: 5,
    slug: "infantil-completo",
    name: "Aniversário Infantil Completo",
    emoji: "👑",
    horario: "Das 15h às 19h",
    valor: "R$ 3.700,00",
    valorNum: 3700,
    tag: "ALL INCLUSIVE",
    color: "#10B981",
    bg: "#ECFDF5",
    capacity: "Até 40 convidados (pai, mãe e aniv. cortesia)",
    includes: [
      "Espaço reservado + Área Kids com monitoria",
      "Decoração básica + Toalhas na cor do tema",
      "Bolo personalizado",
      "Salgados e Docinhos",
      "Água, Refrigerante, Suco e Chope à vontade",
      "2 Garçons",
      "Descartáveis completos",
      "Convite digital personalizado",
      "🅿️ Estacionamento gratuito",
    ],
    bring: [],
    rules: [],
    kids: ["Tobogã inflável","Basquete","Chute a gol","Pebolim","Disco Air Soft","Circuito Brinquedão","Fliperama","Pneu Pula","TV"],
    description: "Festa completa e sem preocupações. Tudo incluso do bolo ao chope.",
  },
];

const SPACES = [
  { id:1, name:"Food Park", desc:"Ambiente aberto com toda a estrutura do parque gastronômico", capacity:"Sem limite fixo", packages:"Pacote 1", emoji:"🌆", gradient:"from-amber-400 to-orange-500" },
  { id:2, name:"Área Kids", desc:"Espaço infantil supervisionado com brinquedos e monitores", capacity:"Até 20 crianças", packages:"Pacotes 2, 4 e 5", emoji:"🎠", gradient:"from-pink-400 to-rose-500" },
  { id:3, name:"Churrasqueira Interna", desc:"Churrasqueira coberta com toda a estrutura de cozinha", capacity:"60 pessoas", packages:"Pacotes 3 e 4", emoji:"🥩", gradient:"from-red-400 to-rose-600" },
  { id:4, name:"Churrasqueira Externa", desc:"Área ao ar livre para o churrasco com espetos e grelha", capacity:"100 pessoas", packages:"Pacotes 3 e 4", emoji:"🔥", gradient:"from-orange-500 to-red-600" },
  { id:5, name:"Quadra de Areia", desc:"Quadra coberta para vôlei, futevôlei e recreação", capacity:"Até 20 jogadores", packages:"Pacotes 3 e 4", emoji:"🏐", gradient:"from-yellow-400 to-amber-500" },
  { id:6, name:"Sinuca", desc:"Mesa de sinuca profissional para entretenimento adulto", capacity:"2-4 pessoas", packages:"Pacotes 3 e 4", emoji:"🎱", gradient:"from-green-500 to-emerald-600" },
  { id:7, name:"Espaço Coberto", desc:"Área coberta com mesas e cadeiras para até 60 pessoas", capacity:"60 pessoas", packages:"Pacotes 3, 4 e 5", emoji:"⛺", gradient:"from-sky-400 to-blue-500" },
  { id:8, name:"Área Externa", desc:"Área aberta integrada para eventos de grande porte", capacity:"100 pessoas", packages:"Pacotes 3 e 4", emoji:"🌿", gradient:"from-teal-400 to-green-600" },
  { id:9, name:"Mesas Decoradas", desc:"Mesas temáticas montadas pela nossa equipe de decoração", capacity:"Conforme evento", packages:"Pacote 5", emoji:"🎀", gradient:"from-purple-400 to-violet-600" },
  { id:10, name:"Festas Realizadas", desc:"Nosso histórico de festas inesquecíveis no Central Food Park", capacity:"—", packages:"Todos os pacotes", emoji:"📸", gradient:"from-indigo-400 to-purple-500" },
];


const SPACE_IMAGES = {
  "s1": "/images/space_s1.jpg",
  "s2": "/images/space_s2.jpg",
  "s3": "/images/space_s3.jpg",
  "s4": "/images/space_s4.jpg",
  "s5": "/images/space_s5.jpg",
  "s6": "/images/space_s6.jpg",
  "s7": "/images/space_s7.jpg",
  "s8": "/images/space_s8.jpg",
  "s9": "/images/space_s9.jpg",
  "s10": "/images/space_s10.jpg",
  "s11": "/images/space_s11.jpg",
};

const SPACES_GRATUITO = [
  { id:"s1",  name:"Lounge ao lado da Sinuca",   capacity:30, emoji:"🎱" },
  { id:"s2",  name:"Lounge frente ao Nikô Sushi",capacity:30, emoji:"🍣" },
  { id:"s3",  name:"Mesas frente ao Palco (A)",  capacity:25, emoji:"🎭" },
  { id:"s4",  name:"Mesas frente ao Palco (B)",  capacity:20, emoji:"🎭" },
  { id:"s5",  name:"Mesa frente ao Lago (A)",    capacity:20, emoji:"🌊" },
  { id:"s6",  name:"Mesa frente ao Lago (B)",    capacity:20, emoji:"🌊" },
  { id:"s7",  name:"Deck do Lago",               capacity:25, emoji:"🛶" },
  { id:"s8",  name:"Deck lado Choperia",         capacity:40, emoji:"🍺" },
  { id:"s9",  name:"Mesa frente Bar/Choperia",   capacity:30, emoji:"🍻" },
  { id:"s10", name:"Mesa frente ao Bar (A)",     capacity:10, emoji:"🍹" },
  { id:"s11", name:"Mesa frente ao Bar (B)",     capacity:15, emoji:"🍹" },
];

// Paid packages don't have a list of interchangeable spaces — each one IS a
// single physical resource (the churrasqueira, the kids party area, etc),
// so it gets one implicit slot id instead of a list to choose from.
function paidPackageSlot(pkgId) { return "pkg-" + pkgId; }

// Shared "is this date+area already taken" check, used both for the
// multi-space picker (free packages) and the single-slot check (paid
// packages). `rows` is either the full `reservations` list (admin) or the
// public-safe `availability` list (data/pacote/espaco/status only).
function isSlotTaken(rows, data, espacoId) {
  return rows.some(r => r.data === data && r.espaco === espacoId && r.status !== "Cancelada");
}

const RULES = [
  "Reservas pagas: a confirmação é feita mediante pagamento integral do valor do pacote escolhido.",
  "Alterações de data dependem de disponibilidade.",
  "Bebidas de fora são proibidas nos pacotes dentro do Food Park, exceto na churrasqueira.",
  "No Pacote Churrasqueira é permitido levar comidas e bebidas.",
  "Música ao vivo é proibida no espaço da churrasqueira.",
  "Permitido apenas som mecânico ambiente.",
  "Decoração deve respeitar o horário contratado.",
  "O tempo de montagem e desmontagem deve ser combinado previamente.",
];

const STATUS_COLORS = {
  "Pré-reserva":        { bg:"#FEF9C3", text:"#92400E", dot:"#FBBF24" },
  "Aguardando pagamento":{ bg:"#FEF3C7", text:"#78350F", dot:"#F59E0B" },
  "Confirmada":         { bg:"#D1FAE5", text:"#065F46", dot:"#10B981" },
  "Cancelada":          { bg:"#FEE2E2", text:"#7F1D1D", dot:"#EF4444" },
  "Finalizada":         { bg:"#E0E7FF", text:"#312E81", dot:"#6366F1" },
};

// ── HELPERS ─────────────────────────────────────────────────────────────────

function whatsappLink(phone, msg) {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/55${clean}?text=${encodeURIComponent(msg)}`;
}

function buildMessage(r) {
  const pkg = PACKAGES.find(p => p.id === r.pacote);
  const proximoPasso = pkg && pkg.valorNum > 0
    ? "Nossa equipe irá confirmar a disponibilidade da data e o recebimento do pagamento da reserva."
    : "Nossa equipe irá confirmar a disponibilidade da data e retornar com a confirmação da sua reserva.";
  return `Olá! Seja bem-vindo ao Central Food Park 🎉\n\nRecebemos sua solicitação de reserva.\n\nPacote escolhido: ${pkg?.name || ""}\nData desejada: ${r.data ? new Date(r.data + "T12:00:00").toLocaleDateString("pt-BR") : ""}\nHorário: ${r.horario}\nQuantidade de convidados: ${(r.adultos||0) + (r.criancas||0)} (${r.adultos||0} adultos + ${r.criancas||0} crianças)\nEspaço reservado: ${r.espaco || "A definir"}\n\n${proximoPasso}\n\nCentral Food Park\nO lugar perfeito para comemorar momentos especiais! 🎊`;
}

// Notification copy sent (by the customer, with one tap) to the business's
// own WhatsApp number, so staff find out about a new reservation right away.
function buildStaffNotification(r) {
  const pkg = PACKAGES.find(p => p.id === r.pacote);
  return `🔔 Nova reserva pelo site!\n\nResponsável: ${r.responsavel}\nWhatsApp: ${r.whatsapp}\nAniversariante: ${r.aniversariante || "-"}\nPacote: ${pkg?.name || ""}\nData desejada: ${r.data ? new Date(r.data + "T12:00:00").toLocaleDateString("pt-BR") : ""}\nHorário: ${r.horario || "-"}\nConvidados: ${(r.adultos||0) + (r.criancas||0)} (${r.adultos||0} adultos + ${r.criancas||0} crianças)\nEspaço: ${r.espaco || "A definir"}\nValor: ${r.valor > 0 ? "R$ " + r.valor.toLocaleString("pt-BR") : "Gratuito"}`;
}

// Message sent to the customer once the admin confirms their reservation.
function buildConfirmationMessage(r) {
  const pkg = PACKAGES.find(p => p.id === r.pacote);
  return `✅ Reserva confirmada!\n\nOlá ${r.responsavel}, sua reserva no Central Food Park está confirmada!\n\nPacote: ${pkg?.name || ""}\nData: ${r.data ? new Date(r.data + "T12:00:00").toLocaleDateString("pt-BR") : ""}\nHorário: ${r.horario || "-"}\nEspaço: ${r.espaco_nome || r.espaco || "-"}\n\nEstamos ansiosos para receber vocês! 🎉\n\nCentral Food Park`;
}

// Shared "confirm" action: marks the reservation as Confirmada in the
// database and opens WhatsApp with the confirmation message ready to send
// to the customer. Used by both the 2-day alert quick-actions and the
// regular status dropdown in the Reservations admin list.
async function confirmReservationAndNotify(r, onDone) {
  await supabase.from("reservations").update({ status: "Confirmada" }).eq("id", r.id);
  onDone?.();
  window.open(whatsappLink(r.whatsapp, buildConfirmationMessage(r)), "_blank", "noopener,noreferrer");
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg:"#F3F4F6", text:"#374151", dot:"#9CA3AF" };
  return (
    <span style={{ background:c.bg, color:c.text, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600, display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:c.dot, display:"inline-block" }} />
      {status}
    </span>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
      setSenha("");
      setTimeout(() => setErro(""), 3000);
    } else {
      onNavigate("home");
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>🔐</div>
          <h2 style={{ color:"#F1F5F9", fontSize:22, fontWeight:800, margin:"0 0 8px" }}>Área Administrativa</h2>
          <p style={{ color:"#64748B", fontSize:14, margin:0 }}>Central Food Park</p>
        </div>

        <div style={{ background:"#1E293B", borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:8, display:"block" }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="seu@email.com"
              style={{ background:"#0F172A", border: erro ? "1.5px solid #EF4444" : "1.5px solid #334155", borderRadius:10, padding:"12px 14px", color:"#F1F5F9", fontSize:15, width:"100%", boxSizing:"border-box", outline:"none" }}
            />
          </div>
          <div>
            <label style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:8, display:"block" }}>Senha</label>
            <div style={{ position:"relative" }}>
              <input
                type={show ? "text" : "password"}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Digite a senha"
                style={{ background:"#0F172A", border: erro ? "1.5px solid #EF4444" : "1.5px solid #334155", borderRadius:10, padding:"12px 44px 12px 14px", color:"#F1F5F9", fontSize:15, width:"100%", boxSizing:"border-box", outline:"none" }}
              />
              <button onClick={() => setShow(s => !s)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#64748B", cursor:"pointer", fontSize:16, padding:0 }}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>
            {erro && <div style={{ color:"#EF4444", fontSize:12, marginTop:6, fontWeight:600 }}>❌ {erro}</div>}
          </div>

          <button onClick={handleLogin} disabled={loading}
            style={{ background:"linear-gradient(135deg,#3B82F6,#6366F1)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:15, fontWeight:800, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Entrando..." : "Entrar →"}
          </button>

          <button onClick={() => onNavigate("home")}
            style={{ background:"transparent", border:"none", color:"#64748B", fontSize:13, cursor:"pointer", padding:"4px" }}>
            ← Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}

function AlertBanner({ reservations, onConfirmed }) {
  const today = new Date();
  const in2days = new Date(today);
  in2days.setDate(today.getDate() + 2);
  const in2str = in2days.toISOString().split("T")[0];
  const alerts = reservations.filter(r => r.data === in2str && r.status !== "Cancelada" && r.status !== "Finalizada");
  if (alerts.length === 0) return null;
  return (
    <div style={{ margin:"0 16px 8px", background:"linear-gradient(135deg,#78350F,#92400E)", border:"1.5px solid #F59E0B", borderRadius:14, padding:14 }}>
      <div style={{ color:"#FCD34D", fontWeight:800, fontSize:14, marginBottom:6 }}>
        ⏰ {alerts.length} reserva{alerts.length>1?"s":""} daqui 2 dias — confirme agora!
      </div>
      {alerts.map(r => {
        const pkg = PACKAGES.find(p => p.id === r.pacote);
        return (
          <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"8px 10px", marginBottom:6 }}>
            <div>
              <div style={{ color:"#FEF3C7", fontWeight:700, fontSize:13 }}>{r.aniversariante} · {r.responsavel}</div>
              <div style={{ color:"#FCD34D", fontSize:11 }}>{pkg?.emoji} {pkg?.name}</div>
            </div>
            <button onClick={() => confirmReservationAndNotify(r, onConfirmed)}
              style={{ background:"#25D366", border:"none", borderRadius:8, padding:"7px 12px", color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer", flexShrink:0 }}>
              ✅ Confirmar
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Home({ onNavigate, reservations, isAdmin, onLogout, onReservationsChange }) {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)" }}>
      {/* Hero */}
      <div style={{ padding:"40px 20px 30px", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
        <h1 style={{ color:"#fff", fontSize:26, fontWeight:800, lineHeight:1.2, margin:"0 0 10px" }}>
          Central Food Park
        </h1>
        <p style={{ color:"#94A3B8", fontSize:15, margin:"0 0 6px" }}>
          Reserve seu aniversário no melhor espaço da cidade
        </p>
        <p style={{ color:"#64748B", fontSize:13 }}>
          Escolha a comemoração que combina com você
        </p>
      </div>

      {/* Package buttons */}
      <div style={{ padding:"0 16px 24px", display:"flex", flexDirection:"column", gap:12 }}>
        {PACKAGES.map(pkg => (
          <button key={pkg.id}
            onClick={() => onNavigate("package", { packageId: pkg.id })}
            style={{ background:`linear-gradient(135deg,${pkg.color}22,${pkg.color}11)`, border:`1.5px solid ${pkg.color}44`, borderRadius:16, padding:"16px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:28 }}>{pkg.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ color:"#F1F5F9", fontWeight:700, fontSize:15 }}>{pkg.name}</div>
              <div style={{ color:"#94A3B8", fontSize:12, marginTop:2 }}>{pkg.horario} · {pkg.valor || "Gratuito"}</div>
            </div>

          </button>
        ))}

        {/* Admin / attendant button */}
        <button onClick={() => onNavigate("admin")}
          style={{ background:"linear-gradient(135deg,#334155,#1E293B)", border:"1.5px solid #475569", borderRadius:16, padding:"16px 18px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:28 }}>💬</span>
          <div style={{ flex:1 }}>
            <div style={{ color:"#F1F5F9", fontWeight:700, fontSize:15 }}>Falar com Atendente</div>
            <div style={{ color:"#94A3B8", fontSize:12, marginTop:2 }}>Tire suas dúvidas pelo WhatsApp</div>
          </div>
        </button>
      </div>

      {/* 2-day alert on home (admin only — shows customer contact info) */}
      {isAdmin && <AlertBanner reservations={reservations} onConfirmed={onReservationsChange} />}

      {/* Nav pills */}
      <div style={{ display:"flex", gap:8, padding:"0 16px 32px", overflowX:"auto" }}>
        {[["🖼️","Galeria","gallery"],["📜","Regras","rules"]].map(([ic,lb,pg]) => (
          <button key={pg} onClick={() => onNavigate(pg)}
            style={{ background:"#1E293B", border:"1.5px solid #334155", borderRadius:12, padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", color:"#CBD5E1", fontSize:13, fontWeight:600 }}>
            {ic} {lb}
          </button>
        ))}
        {isAdmin ? (
          <>
            {[["📅","Calendário","calendar"],["📋","Reservas","reservations"]].map(([ic,lb,pg]) => (
              <button key={pg} onClick={() => onNavigate(pg)}
                style={{ background:"#1D4ED822", border:"1.5px solid #3B82F6", borderRadius:12, padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", color:"#60A5FA", fontSize:13, fontWeight:600 }}>
                {ic} {lb}
              </button>
            ))}
            <button onClick={onLogout}
              style={{ background:"#EF444411", border:"1.5px solid #EF4444", borderRadius:12, padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", color:"#EF4444", fontSize:13, fontWeight:600 }}>
              🔓 Sair
            </button>
          </>
        ) : (
          <button onClick={() => onNavigate("login")}
            style={{ background:"#334155", border:"1.5px solid #475569", borderRadius:12, padding:"10px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", color:"#94A3B8", fontSize:13, fontWeight:600 }}>
            🔐 Admin
          </button>
        )}
      </div>
    </div>
  );
}

function PackagePage({ packageId, onNavigate }) {
  const pkg = PACKAGES.find(p => p.id === packageId);
  if (!pkg) return null;
  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:`linear-gradient(135deg,${pkg.color},${pkg.color}88)`, padding:"32px 20px 24px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:16 }}>← Voltar</button>
        <div style={{ fontSize:40 }}>{pkg.emoji}</div>
        <h2 style={{ color:"#fff", fontSize:22, fontWeight:800, margin:"8px 0 4px" }}>{pkg.name}</h2>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:13, margin:0 }}>{pkg.description}</p>
      </div>

      <div style={{ padding:"20px 16px", display:"flex", flexDirection:"column", gap:16 }}>
        {/* Quick info */}
        <div style={{ background:"#1E293B", borderRadius:14, padding:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <div style={{ color:"#64748B", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Horário</div>
            <div style={{ color:"#F1F5F9", fontSize:14, fontWeight:600 }}>{pkg.horario}</div>
          </div>
          <div>
            <div style={{ color:"#64748B", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Valor</div>
            <div style={{ color:pkg.color, fontSize:16, fontWeight:800 }}>{pkg.valor || "Gratuito"}</div>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <div style={{ color:"#64748B", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Capacidade</div>
            <div style={{ color:"#F1F5F9", fontSize:14 }}>{pkg.capacity}</div>
          </div>
        </div>

        {/* Includes */}
        <div style={{ background:"#1E293B", borderRadius:14, padding:16 }}>
          <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:10 }}>✅ O que está incluso</div>
          {pkg.includes.map((item, i) => (
            <div key={i} style={{ color:"#E2E8F0", fontSize:14, padding:"5px 0", borderBottom:i<pkg.includes.length-1?"1px solid #334155":"none", display:"flex", gap:8 }}>
              <span style={{ color:pkg.color }}>•</span>{item}
            </div>
          ))}
        </div>

        {/* Kit Aniversário */}
        {pkg.kit && (
          <div style={{ background:"linear-gradient(135deg,#78350F22,#1E293B)", border:"1.5px solid #F59E0B55", borderRadius:14, padding:16 }}>
            <div style={{ color:"#FCD34D", fontSize:13, fontWeight:800, textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              🎁 Kit Aniversário — Você ganha!
            </div>
            {pkg.kit.map((item, i) => (
              <div key={i} style={{ color:"#FEF3C7", fontSize:13, padding:"6px 0", borderBottom:i<pkg.kit.length-1?"1px solid #78350F44":"none", lineHeight:1.5 }}>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Bring */}
        {pkg.bring.length > 0 && (
          <div style={{ background:"#1E293B", borderRadius:14, padding:16 }}>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:10 }}>🎒 Pode trazer</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {pkg.bring.map((b,i) => (
                <span key={i} style={{ background:"#0F172A", border:"1px solid #334155", borderRadius:20, padding:"4px 12px", color:"#CBD5E1", fontSize:13 }}>{b}</span>
              ))}
            </div>
          </div>
        )}

        {/* Kids area */}
        {pkg.kids && (
          <div style={{ background:"#1E293B", borderRadius:14, padding:16 }}>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:10 }}>🎠 Área Kids</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {pkg.kids.map((k,i) => (
                <span key={i} style={{ background:"#0F172A", border:`1px solid ${pkg.color}44`, borderRadius:20, padding:"4px 12px", color:pkg.color, fontSize:12, fontWeight:600 }}>{k}</span>
              ))}
            </div>
          </div>
        )}

        {/* Rules */}
        {pkg.rules.length > 0 && (
          <div style={{ background:"#1E293B", borderRadius:14, padding:16 }}>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:10 }}>📋 Regras</div>
            {pkg.rules.map((r,i) => (
              <div key={i} style={{ color:"#CBD5E1", fontSize:13, padding:"4px 0" }}>{r}</div>
            ))}
          </div>
        )}

        <button onClick={() => onNavigate("booking", { packageId: pkg.id })}
          style={{ background:pkg.color, border:"none", borderRadius:14, padding:"16px", color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer" }}>
          Reservar este pacote →
        </button>
      </div>
    </div>
  );
}

function BookingForm({ packageId, availability, blockedDates, onBooked, onNavigate }) {
  const initial = PACKAGES.find(p => p.id === packageId);
  const [form, setForm] = useState({
    responsavel:"", whatsapp:"", data:"", horario:"", aniversariante:"",
    nascimento:"", pacote: packageId || "", adultos:"", criancas:"",
    obs:"", espaco:"", pagamento:"PIX", status:"Pré-reserva", pixConfirmado: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [newRes, setNewRes] = useState(null);

  const pkg = PACKAGES.find(p => p.id === Number(form.pacote));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!form.responsavel || !form.whatsapp || !form.data || !form.pacote || (!form.aniversariante && ![3,4,8].includes(Number(form.pacote)))) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    if (pkg && pkg.valorNum > 0 && !form.pixConfirmado) {
      alert("Por favor confirme que realizou o pagamento PIX antes de finalizar a reserva.");
      return;
    }
    if (blockedDates && blockedDates.includes(form.data)) {
      alert("Esta data está bloqueada e não aceita reservas. Por favor escolha outra data.");
      return;
    }

    const isFree = pkg && pkg.valorNum === 0;
    const espacoId = isFree ? form.espaco : paidPackageSlot(Number(form.pacote));
    if (isFree && !espacoId) {
      alert("Escolha um espaço.");
      return;
    }
    if (isSlotTaken(availability, form.data, espacoId)) {
      alert("Essa data/área acabou de ficar indisponível. Escolha outra data.");
      return;
    }

    const espacoObj = SPACES_GRATUITO.find(s => s.id === espacoId);
    const autoStatus = pkg && pkg.valorNum > 0 ? "Aguardando pagamento" : "Pré-reserva";
    const payload = {
      responsavel: form.responsavel,
      whatsapp: form.whatsapp,
      data: form.data,
      horario: form.horario,
      aniversariante: form.aniversariante,
      nascimento: form.nascimento,
      pacote: Number(form.pacote),
      adultos: Number(form.adultos) || 0,
      criancas: Number(form.criancas) || 0,
      obs: form.obs,
      espaco: espacoId,
      espaco_nome: espacoObj?.name || "",
      pagamento: form.pagamento,
      status: autoStatus,
      valor: pkg?.valorNum || 0,
      pix_confirmado: form.pixConfirmado,
    };

    setSending(true);
    // Deliberately not using `.select()`: anon has no SELECT policy on
    // reservations (by design, so visitors can't read other customers'
    // data), and Postgres requires SELECT-visibility for INSERT...RETURNING,
    // which would otherwise fail with a misleading RLS error even though
    // the insert itself is allowed. We already have everything we need
    // locally in `payload` for the success screen.
    const { error } = await supabase.from("reservations").insert(payload);
    setSending(false);

    if (error) {
      if (error.code === "23505") {
        alert("Essa data/área acabou de ser reservada por outra pessoa. Escolha outra data.");
      } else {
        alert("Não foi possível enviar a reserva. Tente novamente em instantes.");
      }
      return;
    }
    setNewRes(payload);
    setSubmitted(true);
    onBooked?.();
  }

  if (submitted && newRes) {
    const msg = buildMessage(newRes);
    const customerLink = whatsappLink(newRes.whatsapp, msg);
    const staffLink = whatsappLink(BUSINESS_WHATSAPP, buildStaffNotification(newRes));
    return (
      <div style={{ minHeight:"100vh", background:"#0F172A", padding:"32px 16px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
        <div style={{ fontSize:60 }}>🎉</div>
        <h2 style={{ color:"#10B981", fontSize:22, fontWeight:800, textAlign:"center" }}>
          {newRes.valor > 0 ? "Reserva enviada!" : "Pré-reserva registrada!"}
        </h2>
        <p style={{ color:"#94A3B8", textAlign:"center", fontSize:14 }}>
          {newRes.valor > 0
            ? "Aguardando confirmação do comprovante de pagamento pela administração."
            : "Toque nos botões abaixo pra guardar sua confirmação e avisar o Central Food Park pelo WhatsApp."}
        </p>
        <div style={{ background:"#1E293B", borderRadius:14, padding:16, width:"100%", maxWidth:400 }}>
          <div style={{ color:"#64748B", fontSize:11, fontWeight:700, marginBottom:8, textTransform:"uppercase" }}>Mensagem automática</div>
          <pre style={{ color:"#E2E8F0", fontSize:12, whiteSpace:"pre-wrap", margin:0, lineHeight:1.6 }}>{msg}</pre>
        </div>
        <a href={customerLink} target="_blank" rel="noreferrer"
          style={{ background:"#25D366", borderRadius:14, padding:"14px 28px", color:"#fff", fontWeight:800, fontSize:15, textDecoration:"none", display:"flex", alignItems:"center", gap:8 }}>
          📱 Enviar confirmação pra mim
        </a>
        <a href={staffLink} target="_blank" rel="noreferrer"
          style={{ background:"#128C7E", borderRadius:14, padding:"14px 28px", color:"#fff", fontWeight:800, fontSize:15, textDecoration:"none", display:"flex", alignItems:"center", gap:8 }}>
          📤 Avisar o Central Food Park
        </a>
        <button onClick={() => onNavigate("home")}
          style={{ background:"transparent", border:"1px solid #334155", borderRadius:12, padding:"12px 24px", color:"#94A3B8", fontSize:14, cursor:"pointer" }}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const inputStyle = { background:"#1E293B", border:"1.5px solid #334155", borderRadius:10, padding:"12px 14px", color:"#F1F5F9", fontSize:14, width:"100%", boxSizing:"border-box", outline:"none" };
  const labelStyle = { color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:6, display:"block" };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A5F,#0F172A)", padding:"28px 16px 20px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:12 }}>← Voltar</button>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>📋 Nova Reserva</h2>
      </div>

      <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:14 }}>
        <div>
          <label style={labelStyle}>Pacote *</label>
          <select value={form.pacote} onChange={e => set("pacote", e.target.value)} style={inputStyle}>
            <option value="">Selecione um pacote</option>
            {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} — {p.valor || "Gratuito"}</option>)}
          </select>
        </div>

        {[
          ["responsavel","Nome do responsável *","text"],
          ["whatsapp","WhatsApp *","tel"],
          ...([3,4].includes(Number(form.pacote)) ? [] : [["aniversariante","Nome do aniversariante *","text"]]),
          ...(pkg && pkg.valorNum === 0 && [1,6,7].includes(Number(form.pacote)) ? [["nascimento","Data de nascimento","date"]] : pkg && pkg.valorNum > 0 && ![3,4].includes(Number(form.pacote)) ? [["nascimento","Idade do aniversariante","number"]] : []),
          ["data","Data desejada *","date"],
          ["horario","Horário desejado","time"],
          ["adultos","Nº de convidados adultos","number"],
          ["criancas","Nº de crianças","number"],
        ].map(([k,lb,tp]) => (
          <div key={k}>
            <label style={labelStyle}>{lb}</label>
            <input type={tp} value={form[k]} onChange={e => set(k, e.target.value)} style={inputStyle} placeholder={lb.replace(" *","")} />
          </div>
        ))}

        {/* Space selector — only for free packages (paid packages get a single
            availability check below, since each one is a single physical resource) */}
        {pkg && pkg.valorNum === 0 && (
          <div>
            <label style={labelStyle}>Escolha o espaço *</label>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {SPACES_GRATUITO.map(sp => {
                const taken = isSlotTaken(availability, form.data, sp.id);
                const selected = form.espaco === sp.id;
                return (
                  <button key={sp.id} type="button"
                    disabled={taken}
                    onClick={() => !taken && set("espaco", sp.id)}
                    style={{
                      background: taken ? "#0F172A" : selected ? "#3B82F622" : "#1E293B",
                      border: taken ? "1.5px solid #1E293B" : selected ? "1.5px solid #3B82F6" : "1.5px solid #334155",
                      borderRadius:10, padding:"12px 14px", cursor: taken ? "not-allowed" : "pointer",
                      display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
                      opacity: taken ? 0.45 : 1,
                    }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      {SPACE_IMAGES[sp.id] ? (
                        <img src={SPACE_IMAGES[sp.id]} alt={sp.name}
                          style={{ width:52, height:42, objectFit:"cover", borderRadius:8, opacity: taken ? 0.4 : 1, flexShrink:0 }} />
                      ) : (
                        <span style={{ fontSize:20 }}>{sp.emoji}</span>
                      )}
                      <div style={{ textAlign:"left" }}>
                        <div style={{ color: taken ? "#475569" : selected ? "#60A5FA" : "#E2E8F0", fontSize:13, fontWeight:600 }}>{sp.name}</div>
                        <div style={{ color:"#64748B", fontSize:11, marginTop:2 }}>Até {sp.capacity} pessoas sentadas</div>
                      </div>
                    </div>
                    {taken ? (
                      <span style={{ background:"#EF444422", color:"#EF4444", borderRadius:8, padding:"3px 8px", fontSize:11, fontWeight:700 }}>Ocupado</span>
                    ) : selected ? (
                      <span style={{ background:"#3B82F622", color:"#60A5FA", borderRadius:8, padding:"3px 8px", fontSize:11, fontWeight:700 }}>✓ Selecionado</span>
                    ) : (
                      <span style={{ background:"#10B98122", color:"#10B981", borderRadius:8, padding:"3px 8px", fontSize:11, fontWeight:700 }}>Livre</span>
                    )}
                  </button>
                );
              })}
            </div>
            {!form.data && <div style={{ color:"#F59E0B", fontSize:12, marginTop:6 }}>⚠️ Selecione a data primeiro para ver disponibilidade</div>}
            {form.data && blockedDates && blockedDates.includes(form.data) && (
              <div style={{ background:"#EF444422", border:"1px solid #EF4444", borderRadius:8, padding:"8px 12px", marginTop:6, color:"#EF4444", fontSize:13, fontWeight:600 }}>
                🚫 Esta data está bloqueada. Escolha outra data.
              </div>
            )}
          </div>
        )}

        {/* Availability check for paid packages — each one is a single physical
            resource (a churrasqueira, a party area), so it's either free or sold out that day */}
        {pkg && pkg.valorNum > 0 && form.data && (
          isSlotTaken(availability, form.data, paidPackageSlot(pkg.id)) ? (
            <div style={{ background:"#EF444422", border:"1px solid #EF4444", borderRadius:10, padding:"12px 14px", color:"#EF4444", fontSize:13, fontWeight:600 }}>
              🚫 Esgotado: já existe uma reserva do pacote {pkg.name} nesta data. Escolha outra data.
            </div>
          ) : (
            <div style={{ background:"#10B98122", border:"1px solid #10B981", borderRadius:10, padding:"12px 14px", color:"#10B981", fontSize:13, fontWeight:600 }}>
              ✅ Data disponível para o pacote {pkg.name}.
            </div>
          )
        )}

        <div>
          <label style={labelStyle}>Observações</label>
          <textarea value={form.obs} onChange={e => set("obs", e.target.value)} rows={3} style={{ ...inputStyle, resize:"vertical" }} placeholder="Alguma observação importante..." />
        </div>

        {pkg && (
          <div style={{ background:`${pkg.color}22`, border:`1.5px solid ${pkg.color}44`, borderRadius:12, padding:14 }}>
            <div style={{ color:pkg.color, fontWeight:800, fontSize:15 }}>{pkg.emoji} {pkg.name}</div>
            <div style={{ color:"#94A3B8", fontSize:13, marginTop:4 }}>{pkg.horario} · {pkg.valor || "Gratuito"} · {pkg.capacity}</div>
          </div>
        )}

        {/* PIX payment block - only for paid packages */}
        {pkg && pkg.valorNum > 0 && (
          <div style={{ background:"linear-gradient(135deg,#064E3B,#065F46)", border:"1.5px solid #10B981", borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ color:"#6EE7B7", fontWeight:800, fontSize:15 }}>💳 Pagamento via PIX</div>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:12 }}>
              <div style={{ color:"#94A3B8", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:6 }}>Chave PIX (CNPJ)</div>
              <div style={{ color:"#F1F5F9", fontSize:16, fontWeight:800, letterSpacing:1 }}>47.847.874/0001-42</div>
              <div style={{ color:"#6EE7B7", fontSize:12, marginTop:4 }}>Central Food Park</div>
            </div>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:12 }}>
              <div style={{ color:"#94A3B8", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:6 }}>Valor do pacote</div>
              <div style={{ color:"#10B981", fontSize:20, fontWeight:800 }}>{pkg.valor}</div>
            </div>
            <div style={{ background:"#F59E0B22", border:"1px solid #F59E0B55", borderRadius:10, padding:12 }}>
              <div style={{ color:"#FCD34D", fontSize:13, fontWeight:700, marginBottom:4 }}>📱 Após o pagamento:</div>
              <div style={{ color:"#FEF3C7", fontSize:13, lineHeight:1.6 }}>
                Envie o comprovante para nosso WhatsApp:<br/>
                <strong style={{ color:"#FCD34D" }}>{BUSINESS_WHATSAPP}</strong>
              </div>
            </div>
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
              <input type="checkbox" checked={form.pixConfirmado} onChange={e => set("pixConfirmado", e.target.checked)}
                style={{ width:18, height:18, marginTop:2, cursor:"pointer", accentColor:"#10B981" }} />
              <span style={{ color:"#E2E8F0", fontSize:13, lineHeight:1.5 }}>
                Declaro que realizei o pagamento e enviarei o comprovante pelo WhatsApp <strong style={{ color:"#6EE7B7" }}>{BUSINESS_WHATSAPP}</strong>
              </span>
            </label>
            <div style={{ background:"#1E293B", border:"1.5px solid #475569", borderRadius:10, padding:12 }}>
              <div style={{ color:"#F1F5F9", fontSize:12, fontWeight:800, lineHeight:1.7, textTransform:"uppercase", letterSpacing:0.3 }}>
                ⚠️ ATENÇÃO: A RESERVA SERÁ CONCLUÍDA APENAS APÓS A CONFIRMAÇÃO DO PAGAMENTO.<br/><br/>
                • CANCELAMENTO ATÉ 5 DIAS ANTES DO EVENTO: VALOR DEVOLVIDO INTEGRALMENTE.<br/><br/>
                • CANCELAMENTO COM MENOS DE 5 DIAS DA RESERVA: VALOR DEVOLVIDO COM DESCONTO DE MULTA DE R$ 100,00.
              </div>
            </div>
            {!form.pixConfirmado && (
              <div style={{ color:"#F59E0B", fontSize:12 }}>⚠️ Confirme o pagamento para finalizar a reserva</div>
            )}
          </div>
        )}

        <button onClick={handleSubmit} disabled={sending}
          style={{ background:"linear-gradient(135deg,#3B82F6,#6366F1)", border:"none", borderRadius:14, padding:"16px", color:"#fff", fontSize:16, fontWeight:800, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1 }}>
          {sending ? "Enviando..." : "Confirmar pré-reserva →"}
        </button>
      </div>
    </div>
  );
}

function Calendar({ reservations, blockedDates, onBlockedChange, onNavigate }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  const resOnDay = (day) => {
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return reservations.filter(r => r.data === ds);
  };

  const isBlocked = (day) => {
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return blockedDates.includes(ds);
  };

  const toggleBlock = async (day) => {
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if (blockedDates.includes(ds)) {
      await supabase.from("blocked_dates").delete().eq("data", ds);
    } else {
      await supabase.from("blocked_dates").insert({ data: ds });
    }
    onBlockedChange?.();
  };

  const selRes = selected ? resOnDay(selected) : [];

  const prev = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); setSelected(null); };
  const next = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); setSelected(null); };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A5F,#0F172A)", padding:"28px 16px 20px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:12 }}>← Voltar</button>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>📅 Calendário de Reservas</h2>
      </div>

      <div style={{ padding:16 }}>
        <div style={{ background:"#1E293B", borderRadius:16, overflow:"hidden" }}>
          {/* Month nav */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid #334155" }}>
            <button onClick={prev} style={{ background:"#334155", border:"none", borderRadius:8, padding:"6px 12px", color:"#CBD5E1", cursor:"pointer" }}>‹</button>
            <span style={{ color:"#F1F5F9", fontWeight:700, fontSize:16 }}>{monthNames[month]} {year}</span>
            <button onClick={next} style={{ background:"#334155", border:"none", borderRadius:8, padding:"6px 12px", color:"#CBD5E1", cursor:"pointer" }}>›</button>
          </div>

          {/* Day labels */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", textAlign:"center", padding:"8px 8px 4px" }}>
            {["D","S","T","Q","Q","S","S"].map((d,i) => (
              <div key={i} style={{ color:"#64748B", fontSize:11, fontWeight:700 }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, padding:"4px 8px 12px" }}>
            {Array(firstDay).fill(null).map((_,i) => <div key={"e"+i} />)}
            {Array(daysInMonth).fill(null).map((_,i) => {
              const day = i+1;
              const rs = resOnDay(day);
              const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day;
              const isSel = selected===day;
              const blocked = isBlocked(day);
              return (
                <button key={day} onClick={() => setSelected(isSel ? null : day)}
                  style={{ background: blocked ? "#EF444433" : isSel ? "#3B82F6" : isToday ? "#1D4ED8" : rs.length > 0 ? "#7C3AED22" : "transparent",
                    border: blocked ? "2px solid #EF4444" : isToday ? "2px solid #60A5FA" : isSel ? "2px solid #60A5FA" : "2px solid transparent",
                    borderRadius:10, padding:"8px 4px", cursor:"pointer", position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <span style={{ color: blocked ? "#EF4444" : isSel||isToday ? "#fff" : "#E2E8F0", fontSize:13, fontWeight:600 }}>{day}</span>
                  {blocked && <span style={{ fontSize:8 }}>🚫</span>}
                  {!blocked && rs.length > 0 && (
                    <span style={{ background: isSel ? "#fff" : "#8B5CF6", borderRadius:"50%", width:6, height:6, display:"block" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:"flex", gap:12, padding:"12px 0", flexWrap:"wrap" }}>
          {[["#1D4ED8","Hoje"],["#8B5CF6","Com reserva"],["#334155","Disponível"],["#EF4444","Bloqueado"]].map(([c,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:12, height:12, borderRadius:4, background:c, display:"inline-block" }} />
              <span style={{ color:"#94A3B8", fontSize:12 }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Selected day details */}
        {selected && (
          <div style={{ marginTop:8 }}>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:10 }}>
              {String(selected).padStart(2,"0")}/{String(month+1).padStart(2,"0")}/{year}
            </div>
            {selRes.length === 0 ? (
              <div style={{ background:"#1E293B", borderRadius:14, padding:20, textAlign:"center" }}>
                {isBlocked(selected) ? (
                  <>
                    <div style={{ fontSize:28, marginBottom:8 }}>🚫</div>
                    <div style={{ color:"#EF4444", fontWeight:700, marginBottom:4 }}>Data bloqueada</div>
                    <div style={{ color:"#64748B", fontSize:13, marginBottom:12 }}>Nenhuma reserva será aceita neste dia</div>
                    <button onClick={() => toggleBlock(selected)}
                      style={{ background:"#10B981", border:"none", borderRadius:10, padding:"10px 20px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14 }}>
                      ✅ Desbloquear data
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
                    <div style={{ color:"#10B981", fontWeight:700, marginBottom:12 }}>Data disponível</div>
                    <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                      <button onClick={() => onNavigate("booking")}
                        style={{ background:"#3B82F6", border:"none", borderRadius:10, padding:"10px 16px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13 }}>
                        + Nova reserva
                      </button>
                      <button onClick={() => toggleBlock(selected)}
                        style={{ background:"#EF444422", border:"1.5px solid #EF4444", borderRadius:10, padding:"10px 16px", color:"#EF4444", fontWeight:700, cursor:"pointer", fontSize:13 }}>
                        🚫 Bloquear data
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : selRes.map(r => {
              const pkg = PACKAGES.find(p => p.id === r.pacote);
              return (
                <div key={r.id} style={{ background:"#1E293B", borderRadius:14, padding:16, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ color:"#F1F5F9", fontWeight:700, fontSize:15 }}>{r.aniversariante}</div>
                      <div style={{ color:"#64748B", fontSize:12 }}>{r.responsavel} · {r.horario}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ color:"#94A3B8", fontSize:13 }}>{pkg?.emoji} {pkg?.name}</div>
                  <div style={{ color:"#94A3B8", fontSize:13 }}>👥 {r.adultos} adultos · {r.criancas} crianças</div>
                  {r.valor > 0 && <div style={{ color:"#10B981", fontSize:13, fontWeight:700, marginTop:4 }}>R$ {r.valor.toLocaleString("pt-BR")}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Reservations({ reservations, onStatusChange, onNavigate }) {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  const statuses = ["Todas", ...Object.keys(STATUS_COLORS)];

  const today = new Date();
  const in2days = new Date(today);
  in2days.setDate(today.getDate() + 2);
  const in2str = in2days.toISOString().split("T")[0];
  const alertRes = reservations.filter(r => r.data === in2str && r.status !== "Cancelada" && r.status !== "Finalizada");
  const filtered = reservations.filter(r => {
    const matchStatus = filter === "Todas" || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || r.responsavel.toLowerCase().includes(q) || r.aniversariante.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  async function updateStatus(id, status) {
    if (status === "Confirmada") {
      const r = reservations.find(x => x.id === id);
      if (r) { await confirmReservationAndNotify(r, onStatusChange); return; }
    }
    await supabase.from("reservations").update({ status }).eq("id", id);
    onStatusChange?.();
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A5F,#0F172A)", padding:"28px 16px 16px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:12 }}>← Voltar</button>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>📋 Reservas</h2>
          <button onClick={() => onNavigate("booking")}
            style={{ background:"#3B82F6", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Nova</button>
        </div>
      </div>

      <div style={{ padding:"12px 16px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar por nome..."
          style={{ background:"#1E293B", border:"1.5px solid #334155", borderRadius:10, padding:"10px 14px", color:"#F1F5F9", fontSize:14, width:"100%", boxSizing:"border-box", outline:"none", marginBottom:12 }} />
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ background: filter===s ? "#3B82F6" : "#1E293B", border: filter===s ? "none" : "1px solid #334155", borderRadius:20, padding:"6px 14px", color: filter===s ? "#fff" : "#94A3B8", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2-day alert banner */}
      {alertRes.length > 0 && (
        <div style={{ margin:"0 16px 4px", background:"linear-gradient(135deg,#78350F,#92400E)", border:"1.5px solid #F59E0B", borderRadius:14, padding:16 }}>
          <div style={{ color:"#FCD34D", fontWeight:800, fontSize:15, marginBottom:10 }}>
            ⏰ {alertRes.length} reserva{alertRes.length>1?"s":""} em 2 dias — confirme agora!
          </div>
          {alertRes.map(r => {
            const pkg = PACKAGES.find(p => p.id === r.pacote);
            return (
              <div key={r.id} style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:12, marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                <div>
                  <div style={{ color:"#FEF3C7", fontWeight:700, fontSize:14 }}>{r.aniversariante}</div>
                  <div style={{ color:"#FCD34D", fontSize:12 }}>{r.responsavel} · {pkg?.emoji} {pkg?.name}</div>
                  <div style={{ color:"#F59E0B", fontSize:11, marginTop:2 }}>📅 {r.data ? new Date(r.data+"T12:00:00").toLocaleDateString("pt-BR") : ""} às {r.horario}</div>
                </div>
                <button onClick={() => confirmReservationAndNotify(r, onStatusChange)}
                  style={{ background:"#25D366", border:"none", borderRadius:10, padding:"8px 12px", color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  ✅ Confirmar
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ padding:"0 16px 32px", display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:"#64748B" }}>Nenhuma reserva encontrada</div>
        )}
        {filtered.map(r => {
          const pkg = PACKAGES.find(p => p.id === r.pacote);
          const msg = buildMessage(r);
          const link = whatsappLink(r.whatsapp, msg);
          return (
            <div key={r.id} style={{ background:"#1E293B", borderRadius:14, padding:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ color:"#F1F5F9", fontWeight:700, fontSize:16 }}>{r.aniversariante}</div>
                  <div style={{ color:"#64748B", fontSize:12 }}>{r.responsavel}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                {[
                  ["📅",r.data ? new Date(r.data+"T12:00:00").toLocaleDateString("pt-BR") : "—"],
                  ["⏰",r.horario||"—"],
                  ["📦",`${pkg?.emoji||""} ${pkg?.name||"—"}`],
                  ["👥",`${r.adultos||0}A + ${r.criancas||0}C`],
                  ["📍",r.espaco||"—"],
                  ["💰",r.valor>0?`R$ ${r.valor.toLocaleString("pt-BR")}`:"Gratuito"],
                ].map(([ic,val],i) => (
                  <div key={i} style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontSize:12 }}>{ic}</span>
                    <span style={{ color:"#CBD5E1", fontSize:12 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                  style={{ background:"#0F172A", border:"1px solid #334155", borderRadius:8, padding:"6px 10px", color:"#CBD5E1", fontSize:12, cursor:"pointer", flex:1 }}>
                  {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                </select>
                <a href={link} target="_blank" rel="noreferrer"
                  style={{ background:"#25D366", borderRadius:8, padding:"6px 14px", color:"#fff", fontWeight:700, fontSize:12, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>
                  📱 WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Gallery({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A5F,#0F172A)", padding:"28px 16px 20px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:12 }}>← Voltar</button>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>🖼️ Galeria de Espaços</h2>
        <p style={{ color:"#94A3B8", fontSize:13, margin:"6px 0 0" }}>Conheça nossos espaços</p>
      </div>

      <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {SPACES.map(s => (
          <button key={s.id} onClick={() => setSelected(s)}
            style={{ background:"#1E293B", border:"1.5px solid #334155", borderRadius:14, overflow:"hidden", cursor:"pointer", textAlign:"left", padding:0 }}>
            <div style={{ background:`linear-gradient(135deg,var(--g1),var(--g2))`, height:90, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36,
              backgroundImage:`linear-gradient(135deg,${s.gradient.replace("from-","").replace(" to-",",")}` }}>
              <div style={{ background:`linear-gradient(135deg,#${s.gradient.includes("amber")?"F59E0B":s.gradient.includes("pink")?"EC4899":s.gradient.includes("red")?"EF4444":s.gradient.includes("orange")?"F97316":s.gradient.includes("yellow")?"EAB308":s.gradient.includes("green")?"10B981":s.gradient.includes("sky")?"0EA5E9":s.gradient.includes("teal")?"14B8A6":s.gradient.includes("purple")?"8B5CF6":"6366F1"}44,transparent)`, width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:34 }}>{s.emoji}</span>
              </div>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ color:"#F1F5F9", fontSize:13, fontWeight:700 }}>{s.name}</div>
              <div style={{ color:"#64748B", fontSize:11, marginTop:2 }}>{s.capacity}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", zIndex:100 }}
          onClick={() => setSelected(null)}>
          <div style={{ background:"#1E293B", borderRadius:"20px 20px 0 0", padding:24, width:"100%", boxSizing:"border-box" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ textAlign:"center", fontSize:48, marginBottom:12 }}>{selected.emoji}</div>
            <h3 style={{ color:"#F1F5F9", fontSize:20, fontWeight:800, margin:"0 0 8px", textAlign:"center" }}>{selected.name}</h3>
            <p style={{ color:"#94A3B8", fontSize:14, textAlign:"center", margin:"0 0 16px" }}>{selected.desc}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              <div style={{ background:"#0F172A", borderRadius:10, padding:12 }}>
                <div style={{ color:"#64748B", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Capacidade</div>
                <div style={{ color:"#F1F5F9", fontSize:14, marginTop:4 }}>{selected.capacity}</div>
              </div>
              <div style={{ background:"#0F172A", borderRadius:10, padding:12 }}>
                <div style={{ color:"#64748B", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Pacotes</div>
                <div style={{ color:"#F1F5F9", fontSize:14, marginTop:4 }}>{selected.packages}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ width:"100%", background:"#334155", border:"none", borderRadius:12, padding:"14px", color:"#CBD5E1", fontSize:15, fontWeight:700, cursor:"pointer" }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Rules({ onNavigate }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A5F,#0F172A)", padding:"28px 16px 20px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:12 }}>← Voltar</button>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>📜 Regras Importantes</h2>
      </div>
      <div style={{ padding:16, display:"flex", flexDirection:"column", gap:12 }}>
        {RULES.map((r, i) => (
          <div key={i} style={{ background:"#1E293B", borderRadius:14, padding:16, display:"flex", gap:12 }}>
            <div style={{ background:"#3B82F622", borderRadius:8, padding:"6px 10px", color:"#60A5FA", fontWeight:800, fontSize:14, height:"fit-content" }}>{i+1}</div>
            <p style={{ color:"#CBD5E1", fontSize:14, lineHeight:1.6, margin:0 }}>{r}</p>
          </div>
        ))}
        <div style={{ background:"linear-gradient(135deg,#7C3AED22,#1E293B)", border:"1.5px solid #7C3AED44", borderRadius:14, padding:16, marginTop:8 }}>
          <div style={{ color:"#A78BFA", fontWeight:800, fontSize:14, marginBottom:6 }}>⚠️ Atenção</div>
          <p style={{ color:"#94A3B8", fontSize:13, lineHeight:1.6, margin:0 }}>
            Para dúvidas sobre regras específicas do seu evento, entre em contato com nossa equipe pelo WhatsApp antes de confirmar a reserva.
          </p>
        </div>
      </div>
    </div>
  );
}

function Admin({ onNavigate }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0F172A" }}>
      <div style={{ background:"linear-gradient(135deg,#1E3A5F,#0F172A)", padding:"28px 16px 20px" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:10, padding:"6px 12px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:12 }}>← Voltar</button>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>💬 Falar com Atendente</h2>
      </div>
      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16, alignItems:"center" }}>
        <div style={{ fontSize:60 }}>🎉</div>
        <p style={{ color:"#94A3B8", textAlign:"center", fontSize:15, lineHeight:1.7 }}>
          Nossa equipe está pronta para te ajudar a escolher o pacote ideal e tirar todas as suas dúvidas!
        </p>
        <a href={whatsappLink(BUSINESS_WHATSAPP, "Olá! Gostaria de informações sobre reservas no Central Food Park.")} target="_blank" rel="noreferrer"
          style={{ background:"#25D366", borderRadius:14, padding:"16px 32px", color:"#fff", fontWeight:800, fontSize:16, textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
          📱 Abrir WhatsApp
        </a>
        <p style={{ color:"#475569", fontSize:12, textAlign:"center" }}>Atendimento de segunda a domingo, das 9h às 22h</p>
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [params, setParams] = useState({});
  const [session, setSession] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const isAdmin = !!session;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function refreshAvailability() {
    const { data } = await supabase.from("reservation_availability").select("*");
    if (data) setAvailability(data);
  }

  async function refreshBlockedDates() {
    const { data } = await supabase.from("blocked_dates").select("data");
    if (data) setBlockedDates(data.map(d => d.data));
  }

  async function refreshReservations() {
    const { data } = await supabase.from("reservations").select("*").order("data", { ascending: true });
    if (data) setReservations(data);
  }

  useEffect(() => {
    refreshAvailability();
    refreshBlockedDates();
  }, []);

  useEffect(() => {
    if (isAdmin) refreshReservations();
  }, [isAdmin]);

  function onNavigate(pg, prms = {}) {
    setPage(pg);
    setParams(prms);
    window.scrollTo(0, 0);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onNavigate("home");
  }

  if (page === "home")        return <Home onNavigate={onNavigate} reservations={reservations} isAdmin={isAdmin} onLogout={handleLogout} onReservationsChange={() => { refreshReservations(); refreshAvailability(); }} />;
  if (page === "package")     return <PackagePage packageId={params.packageId} onNavigate={onNavigate} />;
  if (page === "booking")     return <BookingForm packageId={params.packageId} availability={availability} blockedDates={blockedDates} onBooked={refreshAvailability} onNavigate={onNavigate} />;
  if (page === "calendar")    return isAdmin ? <Calendar reservations={reservations} blockedDates={blockedDates} onBlockedChange={() => { refreshBlockedDates(); refreshAvailability(); }} onNavigate={onNavigate} /> : <LoginPage onNavigate={onNavigate} />;
  if (page === "reservations")return isAdmin ? <Reservations reservations={reservations} onStatusChange={() => { refreshReservations(); refreshAvailability(); }} onNavigate={onNavigate} /> : <LoginPage onNavigate={onNavigate} />;
  if (page === "gallery")     return <Gallery onNavigate={onNavigate} />;
  if (page === "rules")       return <Rules onNavigate={onNavigate} />;
  if (page === "login")       return <LoginPage onNavigate={onNavigate} />;
  if (page === "admin")       return <Admin onNavigate={onNavigate} />;
  return <Home onNavigate={onNavigate} />;
}
