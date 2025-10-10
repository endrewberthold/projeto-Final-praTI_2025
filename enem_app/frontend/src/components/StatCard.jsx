import React from "react";
import "../styles/components/StatCard.sass";

/**
 * Componente reutilizável para exibir estatísticas com ícone, número e descrição
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.icon - Ícone a ser exibido
 * @param {number} props.value - Valor numérico da estatística
 * @param {string} props.label - Descrição da estatística
 * @param {string} props.className - Classes CSS adicionais (opcional)
 * @param {string} props.variant - Variante do estilo ('default', 'compact', 'large') (opcional)
 */
export default function StatCard({
  icon,
  value,
  label,
  className = "",
  variant = "default"
}) {
  return (
    <div className={`stat-card stat-card--${variant} ${className}`}>
      <div className="stat-card__icon">
        {icon}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
}
