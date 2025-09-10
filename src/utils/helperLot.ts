export const getColorSituationLot = (situationId: number) => {
  if (situationId == 1)
    //disponivel
    return "#0d9252";
  else if (situationId == 2)
    // indisponivel
    return "#666666";
  else if (situationId == 3)
    // vendido
    return "#CC0000";
  else if (situationId == 4)
    //reservado
    return "#F8D402";
  else if (situationId == 5)
    //invadido
    return "#000000";
  else if (situationId == 6)
    // penhorado
    return "#00008B";
  else if (situationId == 7)
    // caucionado
    return "#800080";
};

export const getSituationsLots = () => {
  return [
    { id: 1, nome: "Disponível", color: "#0d9252" },
    { id: 2, nome: "Indisponível", color: "#666666" },
    { id: 3, nome: "Vendido", color: "#CC0000" },
    { id: 4, nome: "Reservado", color: "#F8D402" },
    { id: 5, nome: "Invadido", color: "#000000" },
    { id: 6, nome: "Penhorado", color: "#00008B" },
    { id: 7, nome: "Caucionado", color: "#800080" },
  ];
};
