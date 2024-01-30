const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

app.use(cors());
// Parse JSON and url-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images, stylesheets, and scripts)
app.use(express.static(__dirname));
app.use('/uploaded-images', express.static('uploads')); // Change route to '/uploaded-images'

// Define events array with unique identifiers (id property)
const events = [
	{
		id: 1,
		displayName: 'Baby Lamb',
		title: 'baby_lamb',
		cover: '/uploads/covers/baby_lamb.jpg',
		images: [
			{ path: '/uploads/events/baby_lamb/baby_1.jpg', alt: 'Baby 1' },
			{ path: '/uploads/events/baby_lamb/baby_2.jpg', alt: 'Baby 2' },
			{ path: '/uploads/events/baby_lamb/baby_3.jpg', alt: 'Baby 3' },
			{ path: '/uploads/events/baby_lamb/baby_4.jpg', alt: 'Baby 4' },
		],
		text: `In this world, a lamb did appear,\nTiny feet strong, no need to fear.\nChildhood sweet, like strawberries dear,\nAn adorable journey, drawing near.`,
	},
	{
		id: 2,
		displayName: 'Family & Friends With Lamb',
		title: 'family_&_friends_lamb',
		cover: '/uploads/covers/child_lamb.jpg',
		images: [
			{
				path: '/uploads/events/family_&_friends_lamb/child_1.jpg',
				alt: 'Child 1',
			},
			{
				path: '/uploads/events/family_&_friends_lamb/child_2.jpg',
				alt: 'Child 2',
			},
		],
		text: `In a cradle of joy, a lamb so sweet,\nTiny hooves dancing to a playful beat.\nCurious eyes, exploring each street,\nA fluffy adventurer, in places to meet.`,
	},
	{
		id: 3,
		displayName: 'School Lamb',
		title: 'school_lamb',
		cover: '/uploads/covers/teenage_lamb.jpg',
		images: [
			{ path: '/uploads/events/school_lamb/school_1.jpg', alt: 'School 1' },
			{ path: '/uploads/events/school_lamb/school_2.jpg', alt: 'School 2' },
		],
		text: `School years unfold, my lamb in stride,\nIn Dad's shadow, a comforting guide.\nFamily ties strong, love as our pride,\nHumor, sharing, success side by side.`,
	},
	{
		id: 4,
		displayName: 'Dutch Lamb',
		title: 'dutch_lamb',
		cover: '/uploads/covers/dutch_lamb.jpg',
		images: [
			{ path: '/uploads/events/dutch_lamb/dutch_1.jpg', alt: 'Dutch 1' },
			{ path: '/uploads/events/dutch_lamb/dutch_2.jpg', alt: 'Dutch 2' },
		],
		text: `Guided by winds in Holland's embrace,\nSuccess in business, smiles light up the face.\nLove and career, a harmonious trace,\nA new chapter written in life's warm embrace.`,
	},
	{
		id: 5,
		displayName: 'Happily Married Lamb',
		title: 'married_lamb',
		cover: '/uploads/covers/married_lamb.jpg',
		images: [
			{ path: '/uploads/events/married_lamb/married_1.jpg', alt: 'Married 1' },
			{ path: '/uploads/events/married_lamb/married_2.jpg', alt: 'Married 2' },
		],
		text: `Sloth watches, a friend keeping calm,\nMaster of laughter, chores in love's warm.\nA fairytale marriage, time won't harm,\nEvery moment adds value, love is our charm.`,
	},
];

// Serve the index.html file for the root path
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to fetch events
app.get('/events', (req, res) => {
	res.json(events);
});

// Route to fetch images for a specific event
app.get('/uploads/events/:eventTitle/images', (req, res) => {
	const eventTitle = req.params.eventTitle;
	const eventDirectory = path.join(__dirname, 'uploads', 'events', eventTitle);

	fs.readdir(eventDirectory, (err, files) => {
		if (err) {
			console.error('Error reading event directory:', err);
			res.status(500).send('Error fetching images');
		} else {
			console.log('Files in event directory:', files); // Log filenames

			const images = files.map((file) => ({
				path: `/uploads/events/${eventTitle}/${file}`,
				alt: file.split('.')[0], // Assuming the filename is the alt text
			}));
			res.json(images);
		}
	});
});

// Route to handle event selection
app.get('/handle-event-selection', (req, res) => {
	const selectedEventTitle = req.query.eventTitle;
	// Perform actions based on the selected event title
	// For example, you can fetch data related to the selected event from a database
	// and send it back as a response
	res.send(`Selected event: ${selectedEventTitle}`);
});

// Handle file uploads
app.post('/uploads', upload.single('image'), (req, res) => {
	// Get the event title from the request body
	const eventTitle = req.body.eventTitle;

	// Find the event by title
	const event = events.find((e) => e.title === eventTitle);

	if (!event) {
		return res.status(404).send('Event not found');
	}

	// Construct the directory path for the event based on its title
	const eventDir = path.join(
		__dirname,
		`./uploads/events/${eventTitle.toLowerCase().replace(/ /g, '_')}`
	);

	// Ensure the event directory exists; if not, create it
	if (!fs.existsSync(eventDir)) {
		fs.mkdirSync(eventDir, { recursive: true });
	}

	// Generate a unique filename for the uploaded image
	const uniqueFilename = `${Date.now()}_${Math.floor(
		Math.random() * 1000000
	)}${path.extname(req.file.originalname)}`;

	// Move the uploaded image to the event directory with the unique filename
	const newFilePath = path.join(eventDir, uniqueFilename);

	// Move the file
	fs.rename(req.file.path, newFilePath, (err) => {
		if (err) {
			console.error('Error moving file:', err);
			return res.status(500).send('Error uploading file');
		}

		// Add the new image to the event
		const newImage = {
			path: path.join(
				'/uploads/events',
				eventTitle.toLowerCase().replace(/ /g, '_'),
				uniqueFilename
			),
			alt: req.file.originalname,
		};
		event.images.push(newImage);

		// Send success response
		res.send('Image uploaded successfully');
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
