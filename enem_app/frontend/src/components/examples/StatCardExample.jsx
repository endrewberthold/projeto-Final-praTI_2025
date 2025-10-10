import React from "react";
import { BookOpen, Clock, Users, Trophy, Star, Target } from "lucide-react";
import StatCard from "../StatCard";

/**
 * Exemplo de uso do componente StatCard
 * Demonstra diferentes variações e casos de uso
 */
export default function StatCardExample() {
  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "1200px", 
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "2rem"
    }}>
      <h2>Exemplos de Uso do StatCard</h2>
      
      {/* Exemplo 1: Uso básico */}
      <div>
        <h3>1. Uso Básico</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <StatCard 
            icon={<BookOpen size={20} />} 
            value={9} 
            label="Respostas" 
          />
          <StatCard 
            icon={<Clock size={20} />} 
            value={20} 
            label="Minutos" 
          />
        </div>
      </div>

      {/* Exemplo 2: Diferentes variantes */}
      <div>
        <h3>2. Diferentes Variantes</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <StatCard 
            icon={<BookOpen size={16} />} 
            value={9} 
            label="Respostas" 
            variant="compact"
          />
          <StatCard 
            icon={<Clock size={20} />} 
            value={20} 
            label="Minutos" 
            variant="default"
          />
          <StatCard 
            icon={<Trophy size={24} />} 
            value={5} 
            label="Conquistas" 
            variant="large"
          />
        </div>
      </div>

      {/* Exemplo 3: Diferentes ícones e valores */}
      <div>
        <h3>3. Diferentes Ícones e Valores</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <StatCard 
            icon={<Users size={20} />} 
            value={42} 
            label="Usuários" 
          />
          <StatCard 
            icon={<Star size={20} />} 
            value={4.8} 
            label="Avaliação" 
          />
          <StatCard 
            icon={<Target size={20} />} 
            value={85} 
            label="Precisão" 
          />
          <StatCard 
            icon={<Trophy size={20} />} 
            value={12} 
            label="Troféus" 
          />
        </div>
      </div>

      {/* Exemplo 4: Valores zero */}
      <div>
        <h3>4. Valores Zero</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <StatCard 
            icon={<BookOpen size={20} />} 
            value={0} 
            label="Respostas" 
          />
          <StatCard 
            icon={<Clock size={20} />} 
            value={0} 
            label="Minutos" 
          />
        </div>
      </div>

      {/* Exemplo 5: Com classes CSS customizadas */}
      <div>
        <h3>5. Com Classes CSS Customizadas</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <StatCard 
            icon={<BookOpen size={20} />} 
            value={9} 
            label="Respostas" 
            className="custom-stat-card"
          />
          <StatCard 
            icon={<Clock size={20} />} 
            value={20} 
            label="Minutos" 
            className="custom-stat-card"
          />
        </div>
      </div>

      {/* Exemplo 6: Grid layout */}
      <div>
        <h3>6. Layout em Grid</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem" 
        }}>
          <StatCard 
            icon={<BookOpen size={20} />} 
            value={9} 
            label="Respostas" 
          />
          <StatCard 
            icon={<Clock size={20} />} 
            value={20} 
            label="Minutos" 
          />
          <StatCard 
            icon={<Users size={20} />} 
            value={42} 
            label="Usuários" 
          />
          <StatCard 
            icon={<Trophy size={20} />} 
            value={5} 
            label="Conquistas" 
          />
        </div>
      </div>

      {/* Exemplo 7: Estados especiais */}
      <div>
        <h3>7. Estados Especiais</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <StatCard 
            icon={<BookOpen size={20} />} 
            value={9} 
            label="Respostas" 
          />
          <StatCard 
            icon={<Clock size={20} />} 
            value={20} 
            label="Minutos" 
            className="stat-card--disabled"
          />
          <StatCard 
            icon={<Trophy size={20} />} 
            value={5} 
            label="Conquistas" 
            className="stat-card--loading"
          />
        </div>
      </div>
    </div>
  );
}
