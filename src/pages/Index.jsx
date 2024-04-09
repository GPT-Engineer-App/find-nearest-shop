import { useState, useEffect } from "react";
import { Box, Heading, Text, Image, Flex, Spinner, Button, useToast } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";

const Index = () => {
  const [location, setLocation] = useState(null);
  const [closestShop, setClosestShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Error getting location",
          description: "Please allow location access to find the closest shop.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      },
    );
  }, [toast]);

  useEffect(() => {
    if (location) {
      // Find closest shop based on user's location
      // Replace this with your actual logic to find the closest shop
      const dummyShops = [
        { name: "Shop A", lat: 37.7749, lng: -122.4194 },
        { name: "Shop B", lat: 37.7749, lng: -122.4184 },
        { name: "Shop C", lat: 37.7739, lng: -122.4194 },
      ];

      const closestShop = dummyShops.reduce((closest, shop) => {
        const shopDistance = getDistance(location, shop);
        const closestDistance = getDistance(location, closest);
        return shopDistance < closestDistance ? shop : closest;
      });

      setClosestShop(closestShop);
      setLoading(false);
    }
  }, [location]);

  const getDistance = (location1, location2) => {
    // Calculate distance between two locations using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = toRad(location2.lat - location1.lat);
    const dLng = toRad(location2.lng - location1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(location1.lat)) * Math.cos(toRad(location2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRad = (value) => (value * Math.PI) / 180;

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Find Closest Shop
      </Heading>
      {loading ? (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      ) : closestShop ? (
        <Box>
          <Text fontSize="xl" mb={4}>
            The closest shop to your location is:
          </Text>
          <Flex align="center" mb={4}>
            <FaMapMarkerAlt size={24} color="red" />
            <Text fontSize="2xl" ml={2}>
              {closestShop.name}
            </Text>
          </Flex>
          <Image src={`https://images.unsplash.com/photo-1577086664693-894d8405334a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHxtYXAlMjBzaG93aW5nJTIwJTI0JTdCY2xvc2VzdFNob3AubmFtZSU3RHxlbnwwfHx8fDE3MTI2NjcxODd8MA&ixlib=rb-4.0.3&q=80&w=1080`} alt="Map showing closest shop" mb={4} />
          <Button colorScheme="blue">Get Directions</Button>
        </Box>
      ) : (
        <Text>Unable to find closest shop. Please try again later.</Text>
      )}
    </Box>
  );
};

export default Index;
