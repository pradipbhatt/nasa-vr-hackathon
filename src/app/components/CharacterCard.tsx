// src/components/CharacterCard.tsx
import React from 'react'

interface CharacterCardProps {
  name: string
  description: string
  delay?: number
}

export default function CharacterCard({ name, description, delay = 0 }: CharacterCardProps) {
  return (
    <div 
      className="character-card"
      data-aos="fade-up"
      data-aos-delay={delay}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '1.5rem',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '200px',
        textAlign: 'center' as const,
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#26d0ce' }}>{name}</h3>
      <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{description}</p>
    </div>
  )
}