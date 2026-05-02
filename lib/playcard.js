export function playCardInStorage({
  storage,
  playerId,
  playerName,
  cardType,
  customTopic = "",
  startingHand,
}) {
  // Get all player hands from shared storage.
  const hands = storage.get("playerHands") || {};

  // Get this player's current hand.
  const currentHand = hands[playerId] || startingHand;

  // Stop if the player no longer has this card.
  if (!currentHand.includes(cardType)) return;

  // Remove the played card from their hand.
  const nextHand = currentHand.filter((card) => card !== cardType);

  // Save the updated hand.
  storage.set("playerHands", {
    ...hands,
    [playerId]: nextHand,
  });

  // Get existing played cards.
  const existingPlays = storage.get("plays") || [];

  // Add the new played card.
  storage.set("plays", [
    ...existingPlays,
    {
      id: `${Date.now()}-${Math.random()}`,
      playerId,
      player: playerName,
      cardType,
      customTopic,
      round: storage.get("round") || 1,
      time: Date.now(),
    },
  ]);

  // WOLF updates the current topic.
  if (cardType === "WOLF" && customTopic.trim()) {
    storage.set("currentTopic", customTopic.trim());
  }
}