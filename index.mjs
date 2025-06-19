// Import the Pinecone library
import 'dotenv/config';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone'

// Initialize a Pinecone client with your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const indexName = 'quicksart-js';

// // await pc.createIndexForModel({
// //   name: indexName,
// //   cloud: 'aws',
// //   region: 'us-east-1', 
// //   embed: {
// //     model: 'llama-text-embed-v2',
// //     fieldMap: { text: 'chunk_text' },
// //   },
// //   waitUntilReady: true,
// // });

// const records = [
//   { "_id": "rec1", "chunk_text": "Sởi thì nên tăng cường thực phẩm giàu vitamin A (cà rốt, bí đỏ, gan động vật), bổ sung kẽm (hải sản, hạt), uống đủ nước, ăn thực phẩm dễ tiêu như cháo, súp. Tránh đồ chiên rán, cay.", "category": "nutrition" },
//   { "_id": "rec2", "chunk_text": "Thủy đậu thì nên ăn thực phẩm giàu vitamin C (cam, kiwi), kẽm (hạt, đậu), thực phẩm mềm dễ nuốt (súp, sữa chua). Uống nhiều nước, tránh thực phẩm cay, chua, mặn.", "category": "nutrition" },
//   { "_id": "rec3", "chunk_text": "Tay chân miệng thì nên ăn thức ăn lỏng, mềm (cháo, súp), bổ sung vitamin C (trái cây họ cam), uống nước điện giải. Tránh thức ăn cứng, cay, nóng, hạn chế đồ ngọt.", "category": "nutrition" },
//   { "_id": "rec4", "chunk_text": "Ho gà thì nên ăn các bữa nhỏ, dễ tiêu (cháo, khoai nghiền), bổ sung thực phẩm giàu vitamin C, D (cá, trứng). Uống đủ nước, tránh thực phẩm gây kích ứng họng như đồ chiên.", "category": "nutrition" },
//   { "_id": "rec5", "chunk_text": "Cúm mùa thì nên bổ sung thực phẩm giàu vitamin C (cam, ổi), kẽm (hạt, thịt nạc), ăn súp gà, uống trà gừng mật ong. Tránh thực phẩm nhiều đường, đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec6", "chunk_text": "Viêm phế quản thì nên ăn thực phẩm giàu omega-3 (cá hồi, hạt chia), vitamin C (trái cây tươi), uống đủ nước ấm. Tránh thực phẩm lạnh, đồ uống có gas, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec7", "chunk_text": "Viêm phổi thì nên bổ sung protein (thịt gà, cá), vitamin A, C (rau xanh, trái cây), thực phẩm giàu kẽm (hạt, đậu). Uống nước ấm, tránh thực phẩm nhiều dầu mỡ, đồ ngọt.", "category": "nutrition" },
//   { "_id": "rec8", "chunk_text": "Viêm tai giữa thì nên ăn thực phẩm giàu vitamin A, C (bí đỏ, cam), kẽm (hải sản), uống đủ nước. Tránh thực phẩm gây dị ứng (sữa bò, đậu phộng), đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec9", "chunk_text": "Tiêu chảy cấp thì nên uống dung dịch bù điện giải (ORS), ăn thực phẩm dễ tiêu (chuối chín, gạo trắng, táo nghiền). Tránh sữa, thực phẩm nhiều chất xơ, đồ ngọt.", "category": "nutrition" },
//   { "_id": "rec10", "chunk_text": "Nhiễm giun sán thì nên bổ sung thực phẩm giàu vitamin A (cà rốt, gan), sắt (thịt đỏ, rau xanh). Ăn chín uống sôi, tránh thực phẩm sống, rửa sạch rau củ.", "category": "nutrition" },
//   { "_id": "rec11", "chunk_text": "Hen phế quản thì nên ăn thực phẩm giàu omega-3 (cá mòi, hạt lanh), magiê (hạt, rau xanh), tránh thực phẩm gây dị ứng (tôm, sữa). Hạn chế đồ chiên, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec12", "chunk_text": "Viêm da dị ứng thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin E (hạnh nhân, bơ). Tránh thực phẩm gây dị ứng (trứng, đậu phộng), thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec13", "chunk_text": "Tăng huyết áp thì nên ăn thực phẩm ít muối, giàu kali (chuối, khoai lang), magiê (rau xanh, hạt). Hạn chế thực phẩm chế biến sẵn, đồ chiên rán, rượu bia.", "category": "nutrition" },
//   { "_id": "rec14", "chunk_text": "Đái tháo đường thì nên ăn thực phẩm ít đường, giàu chất xơ (rau xanh, ngũ cốc nguyên hạt), protein nạc (gà, cá). Hạn chế tinh bột trắng, đồ ngọt, trái cây nhiều đường.", "category": "nutrition" },
//   { "_id": "rec15", "chunk_text": "Rối loạn lipid máu thì nên ăn thực phẩm giàu omega-3 (cá hồi, hạt chia), chất xơ (yến mạch, táo). Hạn chế chất béo bão hòa (thịt mỡ, bơ), thực phẩm chiên rán.", "category": "nutrition" },
//   { "_id": "rec16", "chunk_text": "Bệnh tim mạch thì nên ăn thực phẩm giàu omega-3 (cá, hạt), chất xơ (rau, trái cây), ít muối. Hạn chế chất béo trans (đồ chiên, bánh kẹo), rượu bia.", "category": "nutrition" },
//   { "_id": "rec17", "chunk_text": "Ung thư gan thì nên ăn thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), chất xơ (rau, ngũ cốc). Hạn chế rượu bia, thực phẩm chế biến sẵn, thịt đỏ.", "category": "nutrition" },
//   { "_id": "rec18", "chunk_text": "Ung thư phổi thì nên bổ sung thực phẩm giàu vitamin C, E (trái cây, hạt), chất xơ (rau xanh). Tránh thực phẩm chế biến sẵn, thịt hun khói, hạn chế khói thuốc.", "category": "nutrition" },
//   { "_id": "rec19", "chunk_text": "Ung thư vú thì nên ăn thực phẩm giàu chất xơ (ngũ cốc, rau), chất chống oxy hóa (quả mọng, trà xanh). Hạn chế chất béo bão hòa, rượu bia, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec20", "chunk_text": "Ung thư dạ dày thì nên ăn thực phẩm giàu chất xơ (rau củ, trái cây), vitamin C (cam, ổi). Hạn chế thực phẩm muối, hun khói, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec21", "chunk_text": "Thoát vị đĩa đệm thì nên bổ sung thực phẩm giàu canxi (sữa, cá), vitamin D (cá, trứng), omega-3 (hạt, cá). Hạn chế thực phẩm gây viêm (đồ chiên, đường).", "category": "nutrition" },
//   { "_id": "rec22", "chunk_text": "Thoái hóa cột sống thì nên ăn thực phẩm giàu canxi, vitamin D (sữa, cá), collagen (nước hầm xương). Hạn chế thực phẩm nhiều đường, đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec23", "chunk_text": "Viêm khớp thì nên bổ sung omega-3 (cá hồi, hạt chia), vitamin C (trái cây), thực phẩm chống viêm (gừng, nghệ). Tránh thực phẩm chế biến sẵn, thịt đỏ.", "category": "nutrition" },
//   { "_id": "rec24", "chunk_text": "Viêm loét dạ dày – tá tràng thì nên ăn thực phẩm dễ tiêu (cháo, khoai nghiền), giàu chất xơ (rau luộc). Tránh đồ cay, chua, cà phê, rượu bia.", "category": "nutrition" },
//   { "_id": "rec25", "chunk_text": "Hội chứng ruột kích thích thì nên ăn thực phẩm giàu chất xơ hòa tan (yến mạch, táo), tránh thực phẩm gây kích ứng (sữa, gluten). Uống đủ nước, hạn chế đồ chiên.", "category": "nutrition" },
//   { "_id": "rec26", "chunk_text": "Trầm cảm thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin B (ngũ cốc, trứng), magiê (rau xanh). Hạn chế đường, cà phê, rượu bia.", "category": "nutrition" },
//   { "_id": "rec27", "chunk_text": "Rối loạn lo âu thì nên ăn thực phẩm giàu magiê (hạt, rau xanh), vitamin B (thịt nạc, trứng). Hạn chế caffeine, đường, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec28", "chunk_text": "COPD thì nên bổ sung thực phẩm giàu protein (thịt nạc, cá), vitamin C, E (trái cây, hạt). Tránh thực phẩm gây đầy hơi (đậu, cải), đồ chiên.", "category": "nutrition" },
//   { "_id": "rec29", "chunk_text": "Suy thận mạn thì nên ăn thực phẩm ít kali, phốt pho (gạo trắng, táo), protein chất lượng cao (trứng, cá). Hạn chế muối, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec30", "chunk_text": "Loãng xương thì nên bổ sung canxi (sữa, cá), vitamin D (cá, ánh nắng), magiê (hạt). Hạn chế caffeine, thực phẩm nhiều muối.", "category": "nutrition" },
//   { "_id": "rec31", "chunk_text": "Thoái hóa khớp thì nên ăn thực phẩm giàu omega-3 (cá, hạt), collagen (nước hầm xương), vitamin C. Hạn chế thực phẩm gây viêm (đường, đồ chiên).", "category": "nutrition" },
//   { "_id": "rec32", "chunk_text": "Đau lưng mãn tính thì nên bổ sung canxi, vitamin D (sữa, cá), thực phẩm chống viêm (gừng, nghệ). Hạn chế thực phẩm nhiều đường, đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec33", "chunk_text": "Sa sút trí tuệ thì nên ăn thực phẩm giàu omega-3 (cá, hạt), chất chống oxy hóa (quả mọng, trà xanh). Hạn chế đường, chất béo bão hòa, rượu bia.", "category": "nutrition" },
//   { "_id": "rec34", "chunk_text": "Parkinson thì nên bổ sung thực phẩm giàu chất xơ (rau, trái cây), vitamin E (hạt, bơ). Hạn chế protein vào buổi tối, tránh thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec35", "chunk_text": "Đục thủy tinh thể thì nên ăn thực phẩm giàu vitamin A, C, E (cà rốt, cam, hạt). Hạn chế thực phẩm nhiều đường, đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec36", "chunk_text": "Thoái hóa điểm vàng thì nên bổ sung thực phẩm giàu lutein, zeaxanthin (rau xanh, trứng), omega-3 (cá). Hạn chế chất béo trans, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec37", "chunk_text": "Bệnh bụi phổi silic thì nên ăn thực phẩm giàu chất chống oxy hóa (trái cây, rau xanh), vitamin C, E. Uống đủ nước, hạn chế thực phẩm gây viêm (đồ chiên).", "category": "nutrition" },
//   { "_id": "rec38", "chunk_text": "Bệnh bụi phổi amiăng thì nên bổ sung thực phẩm giàu vitamin C, E (cam, hạt), chất xơ (rau, ngũ cốc). Tránh thực phẩm chế biến sẵn, đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec39", "chunk_text": "Bệnh bụi phổi than thì nên ăn thực phẩm giàu chất chống oxy hóa (quả mọng, trà xanh), vitamin C. Uống đủ nước, hạn chế thực phẩm gây viêm.", "category": "nutrition" },
//   { "_id": "rec40", "chunk_text": "Viêm phế quản mãn tính nghề nghiệp thì nên bổ sung omega-3 (cá, hạt), vitamin C (trái cây), uống nước ấm. Tránh thực phẩm lạnh, đồ uống có gas, đồ chiên.", "category": "nutrition" },
//   { "_id": "rec41", "chunk_text": "Bệnh điếc nghề nghiệp do tiếng ồn thì nên ăn thực phẩm giàu magiê (hạt, rau xanh), vitamin B (ngũ cốc). Hạn chế caffeine, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec42", "chunk_text": "Nhiễm độc hóa chất bảo vệ thực vật thì nên bổ sung thực phẩm giải độc (tỏi, nghệ, trà xanh), vitamin C (cam, ổi). Tránh thực phẩm chế biến sẵn, rửa sạch rau củ.", "category": "nutrition" },
//   { "_id": "rec43", "chunk_text": "Bệnh da nghề nghiệp do môi trường ẩm ướt thì nên ăn thực phẩm giàu omega-3 (cá, hạt), vitamin E (bơ, hạnh nhân). Tránh thực phẩm gây dị ứng, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec44", "chunk_text": "Bệnh Leptospira nghề nghiệp thì nên bổ sung thực phẩm giàu vitamin C (trái cây), kẽm (hạt, hải sản). Ăn chín uống sôi, tránh thực phẩm sống.", "category": "nutrition" },
//   { "_id": "rec45", "chunk_text": "Nhiễm HIV thì nên ăn thực phẩm giàu protein (thịt nạc, cá), vitamin C, E (trái cây, hạt). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng.", "category": "nutrition" },
//   { "_id": "rec46", "chunk_text": "Viêm gan B thì nên ăn thực phẩm dễ tiêu (cháo, rau luộc), giàu chất xơ (trái cây, ngũ cốc). Hạn chế rượu bia, thực phẩm nhiều dầu mỡ.", "category": "nutrition" },
//   { "_id": "rec47", "chunk_text": "Viêm gan C thì nên bổ sung thực phẩm giàu chất chống oxy hóa (quả mọng, trà xanh), chất xơ. Hạn chế rượu bia, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec48", "chunk_text": "Bệnh lao nghề nghiệp thì nên ăn thực phẩm giàu protein (thịt, cá), vitamin A, C (cà rốt, cam). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng.", "category": "nutrition" },
//   { "_id": "rec49", "chunk_text": "Nhiễm độc chì thì nên bổ sung thực phẩm giàu canxi (sữa, cá), sắt (thịt đỏ, rau xanh), vitamin C. Hạn chế thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec50", "chunk_text": "Nhiễm độc thủy ngân thì nên ăn thực phẩm giàu selen (hạt Brazil, cá), chất xơ (rau, trái cây). Hạn chế thực phẩm chế biến sẵn, rửa sạch thực phẩm.", "category": "nutrition" },
//   { "_id": "rec51", "chunk_text": "Nhiễm độc benzen thì nên bổ sung thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), vitamin C. Hạn chế thực phẩm chế biến sẵn, đồ chiên.", "category": "nutrition" },
//   { "_id": "rec52", "chunk_text": "Nhiễm độc asen thì nên ăn thực phẩm giàu chất xơ (rau, ngũ cốc), vitamin C, E (trái cây, hạt). Hạn chế thực phẩm chế biến sẵn, rửa sạch thực phẩm.", "category": "nutrition" },
//   { "_id": "rec53", "chunk_text": "Bệnh da nghề nghiệp do cao su và hóa chất thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin E (bơ, hạt). Tránh thực phẩm gây dị ứng, thực phẩm chế biến sẵn.", "category": "nutrition" },
//   { "_id": "rec54", "chunk_text": "Bệnh phóng xạ nghề nghiệp thì nên ăn thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), vitamin C, E. Hạn chế thực phẩm chế biến sẵn, đồ chiên.", "category": "nutrition" },
//   { "_id": "rec55", "chunk_text": "Bệnh đục thủy tinh thể nghề nghiệp thì nên bổ sung thực phẩm giàu vitamin A, C, E (cà rốt, cam, hạt). Hạn chế thực phẩm nhiều đường, đồ chiên rán.", "category": "nutrition" },
//   { "_id": "rec56", "chunk_text": "Bệnh giảm áp nghề nghiệp thì nên ăn thực phẩm giàu omega-3 (cá, hạt), vitamin C (trái cây). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng.", "category": "nutrition" }
// ]
// const records2 = [
//   
// {
//   "_id": "dish1",
//   "dish_name": "Phở bò",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish2",
//   "dish_name": "Phở gà",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish3",
//   "dish_name": "Phở tái nạm gầu",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish4",
//   "dish_name": "Phở sốt vang",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish5",
//   "dish_name": "Phở cuốn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish6",
//   "dish_name": "Bún bò Huế",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish7",
//   "dish_name": "Bún riêu cua",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish8",
//   "dish_name": "Bún ốc",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish9",
//   "dish_name": "Bún mắm",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish10",
//   "dish_name": "Bún cá",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish11",
//   "dish_name": "Bún chả cá",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish12",
//   "dish_name": "Bún thịt nướng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish13",
//   "dish_name": "Bún nem rán",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish14",
//   "dish_name": "Bún tôm",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish15",
//   "dish_name": "Bún hải sản",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish16",
//   "dish_name": "Bún nước lèo Trà Vinh",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish17",
//   "dish_name": "Bún mọc",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish18",
//   "dish_name": "Bún sườn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish19",
//   "dish_name": "Bún thang",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish20",
//   "dish_name": "Bún chả Hà Nội",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish21",
//   "dish_name": "Bún măng vịt",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt vịt",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish22",
//   "dish_name": "Miến lươn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish23",
//   "dish_name": "Miến gà",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish24",
//   "dish_name": "Miến ngan",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt vịt",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish25",
//   "dish_name": "Mì Quảng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish26",
//   "dish_name": "Mì xào giòn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish27",
//   "dish_name": "Mì vịt tiềm",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt vịt",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish28",
//   "dish_name": "Mì trộn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish29",
//   "dish_name": "Hủ tiếu Nam Vang",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish30",
//   "dish_name": "Hủ tiếu gõ",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish31",
//   "dish_name": "Hủ tiếu Mỹ Tho",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish32",
//   "dish_name": "Hủ tiếu sa tế nai",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt nai",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish33",
//   "dish_name": "Hủ tiếu bò viên",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish34",
//   "dish_name": "Hủ tiếu xào",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish35",
//   "dish_name": "Bánh canh cua",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish36",
//   "dish_name": "Bánh canh chả cá",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish37",
//   "dish_name": "Bánh canh Trảng Bàng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish38",
//   "dish_name": "Bánh canh giò heo",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish39",
//   "dish_name": "Bánh đa cua Hải Phòng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish40",
//   "dish_name": "Bánh tằm bì",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish41",
//   "dish_name": "Cơm tấm sườn bì chả",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish42",
//   "dish_name": "Cơm gà xối mỡ",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish43",
//   "dish_name": "Cơm gà Hội An",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish44",
//   "dish_name": "Cơm gà Hải Nam",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish45",
//   "dish_name": "Cơm sườn nướng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish46",
//   "dish_name": "Cơm chiên dương châu",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish47",
//   "dish_name": "Cơm rang trứng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Trứng",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish48",
//   "dish_name": "Cơm hến",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish49",
//   "dish_name": "Cơm cá kho tộ",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish50",
//   "dish_name": "Cơm mắm ruốc",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish51",
//   "dish_name": "Cơm cháy Ninh Bình",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish52",
//   "dish_name": "Cơm nắm muối vừng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish53",
//   "dish_name": "Cơm gà Tam Kỳ",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish54",
//   "dish_name": "Cơm bò lúc lắc",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish55",
//   "dish_name": "Cơm thố",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish56",
//   "dish_name": "Canh chua cá lóc",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish57",
//   "dish_name": "Canh rau đay mồng tơi cua đồng",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish58",
//   "dish_name": "Canh bí đỏ nấu tôm",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish59",
//   "dish_name": "Canh khoai mỡ",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish60",
//   "dish_name": "Canh hến nấu chua",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish61",
//   "dish_name": "Canh dưa chua nấu sườn",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish62",
//   "dish_name": "Canh khổ qua nhồi thịt",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish63",
//   "dish_name": "Canh gà lá é",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish64",
//   "dish_name": "Canh rong biển",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish65",
//   "dish_name": "Canh cải xanh thịt bằm",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish66",
//   "dish_name": "Lẩu mắm",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish67",
//   "dish_name": "Lẩu cá kèo",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish68",
//   "dish_name": "Lẩu gà lá giang",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish69",
//   "dish_name": "Lẩu thập cẩm",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish70",
//   "dish_name": "Lẩu riêu cua bắp bò",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish71",
//   "dish_name": "Lẩu hải sản",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish72",
//   "dish_name": "Lẩu thái",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish73",
//   "dish_name": "Lẩu bò nhúng giấm",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish74",
//   "dish_name": "Lẩu vịt om sấu",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt vịt",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish75",
//   "dish_name": "Lẩu dê",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt dê",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish76",
//   "dish_name": "Cá kho tộ",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish77",
//   "dish_name": "Cá chiên xoài bằm",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish78",
//   "dish_name": "Tôm rim mặn",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish79",
//   "dish_name": "Thịt kho tàu",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish80",
//   "dish_name": "Thịt ba chỉ kho trứng",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish81",
//   "dish_name": "Thịt heo giả cầy",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish82",
//   "dish_name": "Gà kho gừng",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish83",
//   "dish_name": "Gà xào sả ớt",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish84",
//   "dish_name": "Bò xào rau muống",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish85",
//   "dish_name": "Bò sốt vang",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish86",
//   "dish_name": "Bò lúc lắc",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish87",
//   "dish_name": "Mực hấp gừng",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish88",
//   "dish_name": "Mực xào chua ngọt",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish89",
//   "dish_name": "Cua rang me",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish90",
//   "dish_name": "Nghêu hấp sả",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish91",
//   "dish_name": "Hến xào",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish92",
//   "dish_name": "Gỏi bò bóp thấu",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish93",
//   "dish_name": "Gỏi gà xé phay",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish94",
//   "dish_name": "Gỏi cuốn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish95",
//   "dish_name": "Nộm đu đủ bò khô",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish96",
//   "dish_name": "Bánh xèo",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish97",
//   "dish_name": "Bánh khọt",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish98",
//   "dish_name": "Bánh bèo",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish99",
//   "dish_name": "Bánh căn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish100",
//   "dish_name": "Bánh cuốn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish101",
//   "dish_name": "Bánh gối",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish102",
//   "dish_name": "Bánh đúc nóng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish103",
//   "dish_name": "Bánh giò",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish104",
//   "dish_name": "Bánh ít trần",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish105",
//   "dish_name": "Bánh nậm",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish106",
//   "dish_name": "Bánh lọc Huế",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish107",
//   "dish_name": "Bánh hỏi lòng heo",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish108",
//   "dish_name": "Bánh tráng nướng Đà Lạt",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Trứng",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish109",
//   "dish_name": "Bánh tráng trộn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish110",
//   "dish_name": "Bánh tráng cuốn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish111",
//   "dish_name": "Bánh tằm cay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish112",
//   "dish_name": "Nem chua",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Chế biến sẵn",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish113",
//   "dish_name": "Nem nướng",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish114",
//   "dish_name": "Tré Huế",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Chế biến sẵn",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish115",
//   "dish_name": "Chả giò (nem rán)",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish116",
//   "dish_name": "Xôi xéo",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish117",
//   "dish_name": "Xôi gấc",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish118",
//   "dish_name": "Xôi vò",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish119",
//   "dish_name": "Xôi mặn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish120",
//   "dish_name": "Bắp xào",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish121",
//   "dish_name": "Khoai lang nướng",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish122",
//   "dish_name": "Bò bía",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish123",
//   "dish_name": "Cá viên chiên",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish124",
//   "dish_name": "Bánh tiêu",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish125",
//   "dish_name": "Bánh bao chiên",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish126",
//   "dish_name": "Chè đậu xanh",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish127",
//   "dish_name": "Chè đậu đen",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish128",
//   "dish_name": "Chè thập cẩm",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish129",
//   "dish_name": "Chè ba màu",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish130",
//   "dish_name": "Chè trôi nước",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish131",
//   "dish_name": "Chè bưởi",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish132",
//   "dish_name": "Chè khúc bạch",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish133",
//   "dish_name": "Chè sương sáo hạt lựu",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish134",
//   "dish_name": "Tàu hủ nóng",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Đậu hũ",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish135",
//   "dish_name": "Tàu hủ đá",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Đậu hũ",
//   "preparation_method": "Món nước",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish136",
//   "dish_name": "Sữa chua mít",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish137",
//   "dish_name": "Sữa chua nếp cẩm",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish138",
//   "dish_name": "Bánh chuối nướng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish139",
//   "dish_name": "Bánh da lợn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish140",
//   "dish_name": "Bánh bò",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish141",
//   "dish_name": "Bánh đậu xanh",
//   "carbohydrate_type": "Hấp thụ chậm",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish142",
//   "dish_name": "Rau câu dừa",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish143",
//   "dish_name": "Kem dừa",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish144",
//   "dish_name": "Kem chuối",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món tráng miệng"
// },
// {
//   "_id": "dish145",
//   "dish_name": "Bún riêu chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish146",
//   "dish_name": "Bún Huế chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish147",
//   "dish_name": "Lẩu nấm chay",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Chay",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish148",
//   "dish_name": "Bánh xèo chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish149",
//   "dish_name": "Cơm chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish150",
//   "dish_name": "Chả giò chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish151",
//   "dish_name": "Mì xào chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish152",
//   "dish_name": "Gỏi cuốn chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish153",
//   "dish_name": "Bún xào chay",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish154",
//   "dish_name": "Canh nấm rong biển",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Chay",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish155",
//   "dish_name": "Đậu hũ chiên sả",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Đậu hũ",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish156",
//   "dish_name": "Đậu hũ sốt cà",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Đậu hũ",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish157",
//   "dish_name": "Nấm kho tiêu",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish158",
//   "dish_name": "Rau củ kho",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Chay",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish159",
//   "dish_name": "Bún chả Hà Nội",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish160",
//   "dish_name": "Bún thang Hà Nội",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish161",
//   "dish_name": "Phở Hà Nội",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish162",
//   "dish_name": "Bánh đa cua Hải Phòng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish163",
//   "dish_name": "Bánh gai Ninh Giang",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish164",
//   "dish_name": "Cháo lòng Nam Định",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish165",
//   "dish_name": "Bún cá rô đồng Hải Dương",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish166",
//   "dish_name": "Bánh đúc lạc Bắc Giang",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish167",
//   "dish_name": "Bún bò Huế",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish168",
//   "dish_name": "Cơm hến Huế",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish169",
//   "dish_name": "Bánh nậm, bánh lọc Huế",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish170",
//   "dish_name": "Nem lụi Huế",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish171",
//   "dish_name": "Mì Quảng Đà Nẵng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish172",
//   "dish_name": "Bánh tráng cuốn thịt heo Đà Nẵng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish173",
//   "dish_name": "Cao lầu Hội An",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish174",
//   "dish_name": "Cơm gà Hội An",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt gà",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish175",
//   "dish_name": "Bánh căn Nha Trang",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish176",
//   "dish_name": "Nem nướng Ninh Hòa",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish177",
//   "dish_name": "Gỏi cá mai Bình Thuận",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish178",
//   "dish_name": "Bánh hỏi heo quay Bình Định",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish179",
//   "dish_name": "Bánh xèo miền Tây",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish180",
//   "dish_name": "Lẩu mắm Cần Thơ",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish181",
//   "dish_name": "Cá lóc nướng trui An Giang",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish182",
//   "dish_name": "Bún nước lèo Sóc Trăng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish183",
//   "dish_name": "Hủ tiếu Mỹ Tho",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish184",
//   "dish_name": "Bánh tét Trà Vinh",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Chế biến sẵn",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish185",
//   "dish_name": "Bánh pía Sóc Trăng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Không có",
//   "preparation_method": "Món khô",
//   "savory": false,
//   "sweet": true,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish186",
//   "dish_name": "Gỏi sầu đâu Campuchia – An Giang",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish187",
//   "dish_name": "Canh chua bông điên điển",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish188",
//   "dish_name": "Mắm kho",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish189",
//   "dish_name": "Mắm ruốc",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Chế biến sẵn",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish190",
//   "dish_name": "Cua rang muối",
//   "carbohydrate_type": "Không có",
//   "main_protein": "Hải sản",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish191",
//   "dish_name": "Phở",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish192",
//   "dish_name": "Bún bò",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt bò",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish193",
//   "dish_name": "Xôi mặn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
// {
//   "_id": "dish194",
//   "dish_name": "Bánh mì pate",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish195",
//   "dish_name": "Bánh mì ốp la",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Trứng",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish196",
//   "dish_name": "Bánh cuốn",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Thịt heo",
//   "preparation_method": "Món khô",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món ăn vặt"
// },
// {
//   "_id": "dish197",
//   "dish_name": "Mì gói trứng",
//   "carbohydrate_type": "Hấp thụ nhanh",
//   "main_protein": "Trứng",
//   "preparation_method": "Món nước",
//   "savory": true,
//   "sweet": false,
//   "dish_type": "Món chính"
// },
//{
//     "_id": "dish193",
//     "chunk_text": "Xôi mặn",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Thịt heo",
//     "preparation_method": "Món khô",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish194",
//     "chunk_text": "Bánh mì pate",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Pate (gan heo)",
//     "preparation_method": "Nướng bánh, phết pate",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish195",
//     "chunk_text": "Bánh mì ốp la",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Trứng gà",
//     "preparation_method": "Nướng bánh, chiên trứng",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish196",
//     "chunk_text": "Bánh cuốn",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Thịt heo băm",
//     "preparation_method": "Hấp",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish197",
//     "chunk_text": "Mì gói trứng",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Trứng gà",
//     "preparation_method": "Luộc",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish198",
//    "chunk_text": "Cháo trắng hột vịt muối",
//     "carbohydrate_type": "Hấp thụ chậm",
//     "main_protein": "Trứng vịt muối",
//     "preparation_method": "Nấu cháo",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish199",
//     "chunk_text": "Cháo lòng",
//     "carbohydrate_type": "Hấp thụ chậm",
//     "main_protein": "Lòng heo",
//     "preparation_method": "Nấu cháo",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish200",
//    "chunk_text": "Cơm tấm",
//     "carbohydrate_type": "Hấp thụ chậm",
//     "main_protein": "Thịt heo (sườn nướng)",
//     "preparation_method": "Nấu cơm, nướng thịt",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món chính"
//   },
//   {
//     "_id": "dish201",
//     "chunk_text": "Bánh giò",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Thịt heo băm",
//     "preparation_method": "Hấp",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món ăn nhẹ"
//   },
//   {
//     "_id": "dish202",
//    "chunk_text": "Bánh bao",
//     "carbohydrate_type": "Hấp thụ nhanh",
//     "main_protein": "Thịt heo, trứng",
//     "preparation_method": "Hấp",
//     "savory": true,
//     "sweet": false,
//     "dish_type": "Món ăn nhẹ"
//   }
// ]
// // Upsert the records into a namespace
const index = pc.index(indexName).namespace("disease_suggestions");
// await index.upsertRecords(records);
const index2 = pc.index(indexName).namespace("food_suggestions");
// Hàm chia thành các batch nhỏ
// await index2.upsertRecords(records2);
// console.log('Records upserted successfully!');
// // Wait for the upserted vectors to be indexed
// await new Promise(resolve => setTimeout(resolve, 10000));

// // View stats for the index
// const stats = await index.describeIndexStats();
// console.log(stats);


// Define the query
const query = 'Tôi bị tiểu đường và cao huyết áp thì tôi nên ăn như thế nào?';

// Search the dense index
const results = await index.searchRecords({
  query: {
    topK: 10,
    inputs: { text: query },
  },
   rerank: {
    model: 'bge-reranker-v2-m3',
    topN: 3,
    rankFields: ['chunk_text'],
  }
});
// Print the results
results.result.hits.forEach(hit => {
  console.log(`id: ${hit._id}, score: ${hit._score?.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
});
const retrievedChunks = (results.result?.hits ?? []).map(hit => hit.fields?.chunk_text ?? '');

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: 'Bạn là một trợ lý chuyên giúp tạo lại câu hỏi để tìm kiếm thông tin tốt hơn từ dữ liệu y tế.'
    },
    {
      role: 'user',
      content: `
Tôi vừa tìm kiếm với câu: "${query}" và nhận được một số đoạn văn liên quan như sau:

${retrievedChunks.map((text, i) => `(${i + 1}) ${text}`).join('\n\n')}

Dựa vào các đoạn văn này, bạn hãy phân tích và tổng kết lại những chất dinh dưỡng nào cần thiết và chất nào cần tránh cho người có những dấu hiệu bệnh trên theo format sau. các chất cần bổ xung : , Các chất cần nên tránh :, cách chế biến nên tránh : .
`
    }
  ],
  temperature: 0.3,
});
console.log('Câu truy vấn mới:', response.choices[0].message.content);
// console.log(results.result.hits);
// Print the results
// results.result.hits.forEach(hit => {
//   console.log(`id: ${hit._id}, score: ${hit._score?.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
// });

// import 'dotenv/config';
// import { Pinecone } from '@pinecone-database/pinecone';

// const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// const indexName = 'text-embedding-3-small'; // tên bạn đã tạo trên web UI
// const namespace = 'disease_suggestions';

// // Tạo kết nối tới index
// const index = pinecone.index(indexName).namespace(namespace);

// // Dữ liệu cần lưu
// const records =[
//   { "id": "rec1", "values": { "text": "Sởi thì nên tăng cường thực phẩm giàu vitamin A (cà rốt, bí đỏ, gan động vật), bổ sung kẽm (hải sản, hạt), uống đủ nước, ăn thực phẩm dễ tiêu như cháo, súp. Tránh đồ chiên rán, cay." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec2", "values": { "text": "Thủy đậu thì nên ăn thực phẩm giàu vitamin C (cam, kiwi), kẽm (hạt, đậu), thực phẩm mềm dễ nuốt (súp, sữa chua). Uống nhiều nước, tránh thực phẩm cay, chua, mặn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec3", "values": { "text": "Tay chân miệng thì nên ăn thức ăn lỏng, mềm (cháo, súp), bổ sung vitamin C (trái cây họ cam), uống nước điện giải. Tránh thức ăn cứng, cay, nóng, hạn chế đồ ngọt." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec4", "values": { "text": "Ho gà thì nên ăn các bữa nhỏ, dễ tiêu (cháo, khoai nghiền), bổ sung thực phẩm giàu vitamin C, D (cá, trứng). Uống đủ nước, tránh thực phẩm gây kích ứng họng như đồ chiên." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec5", "values": { "text": "Cúm mùa thì nên bổ sung thực phẩm giàu vitamin C (cam, ổi), kẽm (hạt, thịt nạc), ăn súp gà, uống trà gừng mật ong. Tránh thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec6", "values": { "text": "Viêm phế quản thì nên ăn thực phẩm giàu omega-3 (cá hồi, hạt chia), vitamin C (trái cây tươi), uống đủ nước ấm. Tránh thực phẩm lạnh, đồ uống có gas, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec7", "values": { "text": "Viêm phổi thì nên bổ sung protein (thịt gà, cá), vitamin A, C (rau xanh, trái cây), thực phẩm giàu kẽm (hạt, đậu). Uống nước ấm, tránh thực phẩm nhiều dầu mỡ, đồ ngọt." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec8", "values": { "text": "Viêm tai giữa thì nên ăn thực phẩm giàu vitamin A, C (bí đỏ, cam), kẽm (hải sản), uống đủ nước. Tránh thực phẩm gây dị ứng (sữa bò, đậu phộng), đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec9", "values": { "text": "Tiêu chảy cấp thì nên uống dung dịch bù điện giải (ORS), ăn thực phẩm dễ tiêu (chuối chín, gạo trắng, táo nghiền). Tránh sữa, thực phẩm nhiều chất xơ, đồ ngọt." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec10", "values": { "text": "Nhiễm giun sán thì nên bổ sung thực phẩm giàu vitamin A (cà rốt, gan), sắt (thịt đỏ, rau xanh). Ăn chín uống sôi, tránh thực phẩm sống, rửa sạch rau củ." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec11", "values": { "text": "Hen phế quản thì nên ăn thực phẩm giàu omega-3 (cá mòi, hạt lanh), magiê (hạt, rau xanh), tránh thực phẩm gây dị ứng (tôm, sữa). Hạn chế đồ chiên, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec12", "values": { "text": "Viêm da dị ứng thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin E (hạnh nhân, bơ). Tránh thực phẩm gây dị ứng (trứng, đậu phộng), thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec13", "values": { "text": "Tăng huyết áp thì nên ăn thực phẩm ít muối, giàu kali (chuối, khoai lang), magiê (rau xanh, hạt). Hạn chế thực phẩm chế biến sẵn, đồ chiên rán, rượu bia." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec14", "values": { "text": "Đái tháo đường thì nên ăn thực phẩm ít đường, giàu chất xơ (rau xanh, ngũ cốc nguyên hạt), protein nạc (gà, cá). Hạn chế tinh bột trắng, đồ ngọt, trái cây nhiều đường." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec15", "values": { "text": "Rối loạn lipid máu thì nên ăn thực phẩm giàu omega-3 (cá hồi, hạt chia), chất xơ (yến mạch, táo). Hạn chế chất béo bão hòa (thịt mỡ, bơ), thực phẩm chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec16", "values": { "text": "Bệnh tim mạch thì nên ăn thực phẩm giàu omega-3 (cá, hạt), chất xơ (rau, trái cây), ít muối. Hạn chế chất béo trans (đồ chiên, bánh kẹo), rượu bia." }, "metadata": { "category": "tim_mach" } },
//   { "id": "rec17", "values": { "text": "Ung thư gan thì nên ăn thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), chất xơ (rau, ngũ cốc). Hạn chế rượu bia, thực phẩm chế biến sẵn, thịt đỏ." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec18", "values": { "text": "Ung thư phổi thì nên bổ sung thực phẩm giàu vitamin C, E (trái cây, hạt), chất xơ (rau xanh). Tránh thực phẩm chế biến sẵn, thịt hun khói, hạn chế khói thuốc." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec19", "values": { "text": "Ung thư vú thì nên ăn thực phẩm giàu chất xơ (ngũ cốc, rau), chất chống oxy hóa (quả mọng, trà xanh). Hạn chế chất béo bão hòa, rượu bia, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec20", "values": { "text": "Ung thư dạ dày thì nên ăn thực phẩm giàu chất xơ (rau củ, trái cây), vitamin C (cam, ổi). Hạn chế thực phẩm muối, hun khói, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec21", "values": { "text": "Thoát vị đĩa đệm thì nên bổ sung thực phẩm giàu canxi (sữa, cá), vitamin D (cá, trứng), omega-3 (hạt, cá). Hạn chế thực phẩm gây viêm (đồ chiên, đường)." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec22", "values": { "text": "Thoái hóa cột sống thì nên ăn thực phẩm giàu canxi, vitamin D (sữa, cá), collagen (nước hầm xương). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec23", "values": { "text": "Viêm khớp thì nên bổ sung omega-3 (cá hồi, hạt chia), vitamin C (trái cây), thực phẩm chống viêm (gừng, nghệ). Tránh thực phẩm chế biến sẵn, thịt đỏ." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec24", "values": { "text": "Viêm loét dạ dày – tá tràng thì nên ăn thực phẩm dễ tiêu (cháo, khoai nghiền), giàu chất xơ (rau luộc). Tránh đồ cay, chua, cà phê, rượu bia." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec25", "values": { "text": "Hội chứng ruột kích thích thì nên ăn thực phẩm giàu chất xơ hòa tan (yến mạch, táo), tránh thực phẩm gây kích ứng (sữa, gluten). Uống đủ nước, hạn chế đồ chiên." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec26", "values": { "text": "Trầm cảm thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin B (ngũ cốc, trứng), magiê (rau xanh). Hạn chế đường, cà phê, rượu bia." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec27", "values": { "text": "Rối loạn lo âu thì nên ăn thực phẩm giàu magiê (hạt, rau xanh), vitamin B (thịt nạc, trứng). Hạn chế caffeine, đường, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec28", "values": { "text": "COPD thì nên bổ sung thực phẩm giàu protein (thịt nạc, cá), vitamin C, E (trái cây Hawkins, hạt). Tránh thực phẩm gây đầy hơi (đậu, cải), đồ chiên." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec29", "values": { "text": "Suy thận mạn thì nên ăn thực phẩm ít kali, phốt pho (gạo trắng, táo), protein chất lượng cao (trứng, cá). Hạn chế muối, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec30", "values": { "text": "Loãng xương thì nên bổ sung canxi (sữa, cá), vitamin D (cá, ánh nắng), magiê (hạt). Hạn chế caffeine, thực phẩm nhiều muối." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec31", "values": { "text": "Thoái hóa khớp thì nên ăn thực phẩm giàu omega-3 (cá, hạt), collagen (nước hầm xương), vitamin C. Hạn chế thực phẩm gây viêm (đường, đồ chiên)." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec32", "values": { "text": "Đau lưng mãn tính thì nên bổ sung canxi, vitamin D (sữa, cá), thực phẩm chống viêm (gừng, nghệ). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec33", "values": { "text": "Sa sút trí tuệ thì nên ăn thực phẩm giàu omega-3 (cá, hạt), chất chống oxy hóa (quả mọng, trà xanh). Hạn chế đường, chất béo bão hòa, rượu bia." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec34", "values": { "text": "Parkinson thì nên bổ sung thực phẩm giàu chất xơ (rau, trái cây), vitamin E (hạt, bơ). Hạn chế protein vào buổi tối, tránh thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec35", "values": { "text": "Đục thủy tinh thể thì nên ăn thực phẩm giàu vitamin A, C, E (cà rốt, cam, hạt). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec36", "values": { "text": "Thoái hóa điểm vàng thì nên bổ sung thực phẩm giàu lutein, zeaxanthin (rau xanh, trứng), omega-3 (cá). Hạn chế chất béo trans, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec37", "values": { "text": "Bệnh bụi phổi silic thì nên ăn thực phẩm giàu chất chống oxy hóa (trái cây, rau xanh), vitamin C, E. Uống đủ nước, hạn chế thực phẩm gây viêm (đồ chiên)." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec38", "values": { "text": "Bệnh bụi phổi amiăng thì nên bổ sung thực phẩm giàu vitamin C, E (cam, hạt), chất xơ (rau, ngũ cốc). Tránh thực phẩm chế biến sẵn, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec39", "values": { "text": "Bệnh bụi phổi than thì nên ăn thực phẩm giàu chất chống oxy hóa (quả mọng, trà xanh), vitamin C. Uống đủ nước, hạn chế thực phẩm gây viêm." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec40", "values": { "text": "Viêm phế quản mãn tính nghề nghiệp thì nên bổ sung omega-3 (cá, hạt), vitamin C (trái cây), uống nước ấm. Tránh thực phẩm lạnh, đồ uống có gas, đồ chiên." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec41", "values": { "text": "Bệnh điếc nghề nghiệp do tiếng ồn thì nên ăn thực phẩm giàu magiê (hạt, rau xanh), vitamin B (ngũ cốc). Hạn chế caffeine, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec42", "values": { "text": "Nhiễm độc hóa chất bảo vệ thực vật thì nên bổ sung thực phẩm giải độc (tỏi, nghệ, trà xanh), vitamin C (cam, ổi). Tránh thực phẩm chế biến sẵn, rửa sạch rau củ." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec43", "values": { "text": "Bệnh da nghề nghiệp do môi trường ẩm ướt thì nên ăn thực phẩm giàu omega-3 (cá, hạt), vitamin E (bơ, hạnh nhân). Tránh thực phẩm gây dị ứng, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec44", "values": { "text": "Bệnh Leptospira nghề nghiệp thì nên bổ sung thực phẩm giàu vitamin C (trái cây), kẽm (hạt, hải sản). Ăn chín uống sôi, tránh thực phẩm sống." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec45", "values": { "text": "Nhiễm HIV thì nên ăn thực phẩm giàu protein (thịt nạc, cá), vitamin C, E (trái cây, hạt). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec46", "values": { "text": "Viêm gan B thì nên ăn thực phẩm dễ tiêu (cháo, rau luộc), giàu chất xơ (trái cây, ngũ cốc). Hạn chế rượu bia, thực phẩm nhiều dầu mỡ." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec47", "values": { "text": "Viêm gan C thì nên bổ sung thực phẩm giàu chất chống oxy hóa (quả mọng, trà xanh), chất xơ. Hạn chế rượu bia, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec48", "values": { "text": "Bệnh lao nghề nghiệp thì nên ăn thực phẩm giàu protein (thịt, cá), vitamin A, C (cà rốt, cam). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec49", "values": { "text": "Nhiễm độc chì thì nên bổ sung thực phẩm giàu canxi (sữa, cá), sắt (thịt đỏ, rau xanh), vitamin C. Hạn chế thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec50", "values": { "text": "Nhiễm độc thủy ngân thì nên ăn thực phẩm giàu selen (hạt Brazil, cá), chất xơ (rau, trái cây). Hạn chế thực phẩm chế biến sẵn, rửa sạch thực phẩm." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec51", "values": { "text": "Nhiễm độc benzen thì nên bổ sung thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), vitamin C. Hạn chế thực phẩm chế biến sẵn, đồ chiên." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec52", "values": { "text": "Nhiễm độc asen thì nên ăn thực phẩm giàu chất xơ (rau, ngũ cốc), vitamin C, E (trái cây, hạt). Hạn chế thực phẩm chế biến sẵn, rửa sạch thực phẩm." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec53", "values": { "text": "Bệnh da nghề nghiệp do cao su và hóa chất thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin E (bơ, hạt). Tránh thực phẩm gây dị ứng, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec54", "values": { "text": "Bệnh phóng xạ nghề nghiệp thì nên ăn thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), vitamin C, E. Hạn chế thực phẩm chế biến sẵn, đồ chiên." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec55", "values": { "text": "Bệnh đục thủy tinh thể nghề nghiệp thì nên bổ sung thực phẩm giàu vitamin A, C, E (cà rốt, cam, hạt). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
//   { "id": "rec56", "values": { "text": "Bệnh giảm áp nghề nghiệp thì nên ăn thực phẩm giàu omega-3 (cá, hạt), vitamin C (trái cây). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng." }, "metadata": { "category": "nutrition" } }
// ]

// // Upsert (Pinecone sẽ tự nhúng bằng model OpenAI tích hợp)
// await index.upsert(records);

// console.log('✅ Đã upsert vào serverless index.');

// import 'dotenv/config';
// import OpenAI from 'openai'
// import { Pinecone } from '@pinecone-database/pinecone'

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
// const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// const index = pinecone.index('text-embedding-3-small').namespace('disease_suggestions');

// // const records =[
// //   { "id": "rec1", "values": { "text": "Sởi thì nên tăng cường thực phẩm giàu vitamin A (cà rốt, bí đỏ, gan động vật), bổ sung kẽm (hải sản, hạt), uống đủ nước, ăn thực phẩm dễ tiêu như cháo, súp. Tránh đồ chiên rán, cay." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec2", "values": { "text": "Thủy đậu thì nên ăn thực phẩm giàu vitamin C (cam, kiwi), kẽm (hạt, đậu), thực phẩm mềm dễ nuốt (súp, sữa chua). Uống nhiều nước, tránh thực phẩm cay, chua, mặn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec3", "values": { "text": "Tay chân miệng thì nên ăn thức ăn lỏng, mềm (cháo, súp), bổ sung vitamin C (trái cây họ cam), uống nước điện giải. Tránh thức ăn cứng, cay, nóng, hạn chế đồ ngọt." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec4", "values": { "text": "Ho gà thì nên ăn các bữa nhỏ, dễ tiêu (cháo, khoai nghiền), bổ sung thực phẩm giàu vitamin C, D (cá, trứng). Uống đủ nước, tránh thực phẩm gây kích ứng họng như đồ chiên." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec5", "values": { "text": "Cúm mùa thì nên bổ sung thực phẩm giàu vitamin C (cam, ổi), kẽm (hạt, thịt nạc), ăn súp gà, uống trà gừng mật ong. Tránh thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec6", "values": { "text": "Viêm phế quản thì nên ăn thực phẩm giàu omega-3 (cá hồi, hạt chia), vitamin C (trái cây tươi), uống đủ nước ấm. Tránh thực phẩm lạnh, đồ uống có gas, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec7", "values": { "text": "Viêm phổi thì nên bổ sung protein (thịt gà, cá), vitamin A, C (rau xanh, trái cây), thực phẩm giàu kẽm (hạt, đậu). Uống nước ấm, tránh thực phẩm nhiều dầu mỡ, đồ ngọt." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec8", "values": { "text": "Viêm tai giữa thì nên ăn thực phẩm giàu vitamin A, C (bí đỏ, cam), kẽm (hải sản), uống đủ nước. Tránh thực phẩm gây dị ứng (sữa bò, đậu phộng), đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec9", "values": { "text": "Tiêu chảy cấp thì nên uống dung dịch bù điện giải (ORS), ăn thực phẩm dễ tiêu (chuối chín, gạo trắng, táo nghiền). Tránh sữa, thực phẩm nhiều chất xơ, đồ ngọt." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec10", "values": { "text": "Nhiễm giun sán thì nên bổ sung thực phẩm giàu vitamin A (cà rốt, gan), sắt (thịt đỏ, rau xanh). Ăn chín uống sôi, tránh thực phẩm sống, rửa sạch rau củ." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec11", "values": { "text": "Hen phế quản thì nên ăn thực phẩm giàu omega-3 (cá mòi, hạt lanh), magiê (hạt, rau xanh), tránh thực phẩm gây dị ứng (tôm, sữa). Hạn chế đồ chiên, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec12", "values": { "text": "Viêm da dị ứng thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin E (hạnh nhân, bơ). Tránh thực phẩm gây dị ứng (trứng, đậu phộng), thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec13", "values": { "text": "Tăng huyết áp thì nên ăn thực phẩm ít muối, giàu kali (chuối, khoai lang), magiê (rau xanh, hạt). Hạn chế thực phẩm chế biến sẵn, đồ chiên rán, rượu bia." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec14", "values": { "text": "Đái tháo đường thì nên ăn thực phẩm ít đường, giàu chất xơ (rau xanh, ngũ cốc nguyên hạt), protein nạc (gà, cá). Hạn chế tinh bột trắng, đồ ngọt, trái cây nhiều đường." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec15", "values": { "text": "Rối loạn lipid máu thì nên ăn thực phẩm giàu omega-3 (cá hồi, hạt chia), chất xơ (yến mạch, táo). Hạn chế chất béo bão hòa (thịt mỡ, bơ), thực phẩm chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec16", "values": { "text": "Bệnh tim mạch thì nên ăn thực phẩm giàu omega-3 (cá, hạt), chất xơ (rau, trái cây), ít muối. Hạn chế chất béo trans (đồ chiên, bánh kẹo), rượu bia." }, "metadata": { "category": "tim_mach" } },
// //   { "id": "rec17", "values": { "text": "Ung thư gan thì nên ăn thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), chất xơ (rau, ngũ cốc). Hạn chế rượu bia, thực phẩm chế biến sẵn, thịt đỏ." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec18", "values": { "text": "Ung thư phổi thì nên bổ sung thực phẩm giàu vitamin C, E (trái cây, hạt), chất xơ (rau xanh). Tránh thực phẩm chế biến sẵn, thịt hun khói, hạn chế khói thuốc." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec19", "values": { "text": "Ung thư vú thì nên ăn thực phẩm giàu chất xơ (ngũ cốc, rau), chất chống oxy hóa (quả mọng, trà xanh). Hạn chế chất béo bão hòa, rượu bia, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec20", "values": { "text": "Ung thư dạ dày thì nên ăn thực phẩm giàu chất xơ (rau củ, trái cây), vitamin C (cam, ổi). Hạn chế thực phẩm muối, hun khói, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec21", "values": { "text": "Thoát vị đĩa đệm thì nên bổ sung thực phẩm giàu canxi (sữa, cá), vitamin D (cá, trứng), omega-3 (hạt, cá). Hạn chế thực phẩm gây viêm (đồ chiên, đường)." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec22", "values": { "text": "Thoái hóa cột sống thì nên ăn thực phẩm giàu canxi, vitamin D (sữa, cá), collagen (nước hầm xương). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec23", "values": { "text": "Viêm khớp thì nên bổ sung omega-3 (cá hồi, hạt chia), vitamin C (trái cây), thực phẩm chống viêm (gừng, nghệ). Tránh thực phẩm chế biến sẵn, thịt đỏ." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec24", "values": { "text": "Viêm loét dạ dày – tá tràng thì nên ăn thực phẩm dễ tiêu (cháo, khoai nghiền), giàu chất xơ (rau luộc). Tránh đồ cay, chua, cà phê, rượu bia." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec25", "values": { "text": "Hội chứng ruột kích thích thì nên ăn thực phẩm giàu chất xơ hòa tan (yến mạch, táo), tránh thực phẩm gây kích ứng (sữa, gluten). Uống đủ nước, hạn chế đồ chiên." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec26", "values": { "text": "Trầm cảm thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin B (ngũ cốc, trứng), magiê (rau xanh). Hạn chế đường, cà phê, rượu bia." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec27", "values": { "text": "Rối loạn lo âu thì nên ăn thực phẩm giàu magiê (hạt, rau xanh), vitamin B (thịt nạc, trứng). Hạn chế caffeine, đường, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec28", "values": { "text": "COPD thì nên bổ sung thực phẩm giàu protein (thịt nạc, cá), vitamin C, E (trái cây Hawkins, hạt). Tránh thực phẩm gây đầy hơi (đậu, cải), đồ chiên." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec29", "values": { "text": "Suy thận mạn thì nên ăn thực phẩm ít kali, phốt pho (gạo trắng, táo), protein chất lượng cao (trứng, cá). Hạn chế muối, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec30", "values": { "text": "Loãng xương thì nên bổ sung canxi (sữa, cá), vitamin D (cá, ánh nắng), magiê (hạt). Hạn chế caffeine, thực phẩm nhiều muối." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec31", "values": { "text": "Thoái hóa khớp thì nên ăn thực phẩm giàu omega-3 (cá, hạt), collagen (nước hầm xương), vitamin C. Hạn chế thực phẩm gây viêm (đường, đồ chiên)." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec32", "values": { "text": "Đau lưng mãn tính thì nên bổ sung canxi, vitamin D (sữa, cá), thực phẩm chống viêm (gừng, nghệ). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec33", "values": { "text": "Sa sút trí tuệ thì nên ăn thực phẩm giàu omega-3 (cá, hạt), chất chống oxy hóa (quả mọng, trà xanh). Hạn chế đường, chất béo bão hòa, rượu bia." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec34", "values": { "text": "Parkinson thì nên bổ sung thực phẩm giàu chất xơ (rau, trái cây), vitamin E (hạt, bơ). Hạn chế protein vào buổi tối, tránh thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec35", "values": { "text": "Đục thủy tinh thể thì nên ăn thực phẩm giàu vitamin A, C, E (cà rốt, cam, hạt). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec36", "values": { "text": "Thoái hóa điểm vàng thì nên bổ sung thực phẩm giàu lutein, zeaxanthin (rau xanh, trứng), omega-3 (cá). Hạn chế chất béo trans, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec37", "values": { "text": "Bệnh bụi phổi silic thì nên ăn thực phẩm giàu chất chống oxy hóa (trái cây, rau xanh), vitamin C, E. Uống đủ nước, hạn chế thực phẩm gây viêm (đồ chiên)." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec38", "values": { "text": "Bệnh bụi phổi amiăng thì nên bổ sung thực phẩm giàu vitamin C, E (cam, hạt), chất xơ (rau, ngũ cốc). Tránh thực phẩm chế biến sẵn, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec39", "values": { "text": "Bệnh bụi phổi than thì nên ăn thực phẩm giàu chất chống oxy hóa (quả mọng, trà xanh), vitamin C. Uống đủ nước, hạn chế thực phẩm gây viêm." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec40", "values": { "text": "Viêm phế quản mãn tính nghề nghiệp thì nên bổ sung omega-3 (cá, hạt), vitamin C (trái cây), uống nước ấm. Tránh thực phẩm lạnh, đồ uống có gas, đồ chiên." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec41", "values": { "text": "Bệnh điếc nghề nghiệp do tiếng ồn thì nên ăn thực phẩm giàu magiê (hạt, rau xanh), vitamin B (ngũ cốc). Hạn chế caffeine, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec42", "values": { "text": "Nhiễm độc hóa chất bảo vệ thực vật thì nên bổ sung thực phẩm giải độc (tỏi, nghệ, trà xanh), vitamin C (cam, ổi). Tránh thực phẩm chế biến sẵn, rửa sạch rau củ." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec43", "values": { "text": "Bệnh da nghề nghiệp do môi trường ẩm ướt thì nên ăn thực phẩm giàu omega-3 (cá, hạt), vitamin E (bơ, hạnh nhân). Tránh thực phẩm gây dị ứng, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec44", "values": { "text": "Bệnh Leptospira nghề nghiệp thì nên bổ sung thực phẩm giàu vitamin C (trái cây), kẽm (hạt, hải sản). Ăn chín uống sôi, tránh thực phẩm sống." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec45", "values": { "text": "Nhiễm HIV thì nên ăn thực phẩm giàu protein (thịt nạc, cá), vitamin C, E (trái cây, hạt). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec46", "values": { "text": "Viêm gan B thì nên ăn thực phẩm dễ tiêu (cháo, rau luộc), giàu chất xơ (trái cây, ngũ cốc). Hạn chế rượu bia, thực phẩm nhiều dầu mỡ." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec47", "values": { "text": "Viêm gan C thì nên bổ sung thực phẩm giàu chất chống oxy hóa (quả mọng, trà xanh), chất xơ. Hạn chế rượu bia, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec48", "values": { "text": "Bệnh lao nghề nghiệp thì nên ăn thực phẩm giàu protein (thịt, cá), vitamin A, C (cà rốt, cam). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec49", "values": { "text": "Nhiễm độc chì thì nên bổ sung thực phẩm giàu canxi (sữa, cá), sắt (thịt đỏ, rau xanh), vitamin C. Hạn chế thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec50", "values": { "text": "Nhiễm độc thủy ngân thì nên ăn thực phẩm giàu selen (hạt Brazil, cá), chất xơ (rau, trái cây). Hạn chế thực phẩm chế biến sẵn, rửa sạch thực phẩm." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec51", "values": { "text": "Nhiễm độc benzen thì nên bổ sung thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), vitamin C. Hạn chế thực phẩm chế biến sẵn, đồ chiên." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec52", "values": { "text": "Nhiễm độc asen thì nên ăn thực phẩm giàu chất xơ (rau, ngũ cốc), vitamin C, E (trái cây, hạt). Hạn chế thực phẩm chế biến sẵn, rửa sạch thực phẩm." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec53", "values": { "text": "Bệnh da nghề nghiệp do cao su và hóa chất thì nên bổ sung thực phẩm giàu omega-3 (cá, hạt), vitamin E (bơ, hạt). Tránh thực phẩm gây dị ứng, thực phẩm chế biến sẵn." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec54", "values": { "text": "Bệnh phóng xạ nghề nghiệp thì nên ăn thực phẩm giàu chất chống oxy hóa (trà xanh, quả mọng), vitamin C, E. Hạn chế thực phẩm chế biến sẵn, đồ chiên." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec55", "values": { "text": "Bệnh đục thủy tinh thể nghề nghiệp thì nên bổ sung thực phẩm giàu vitamin A, C, E (cà rốt, cam, hạt). Hạn chế thực phẩm nhiều đường, đồ chiên rán." }, "metadata": { "category": "nutrition" } },
// //   { "id": "rec56", "values": { "text": "Bệnh giảm áp nghề nghiệp thì nên ăn thực phẩm giàu omega-3 (cá, hạt), vitamin C (trái cây). Hạn chế thực phẩm chế biến sẵn, duy trì cân nặng." }, "metadata": { "category": "nutrition" } }
// // ]
// // // const texts = records.map(r => r.values);

// // // // Nhúng tất cả văn bản
// // // const embeddingsResponse = await openai.embeddings.create({
// // //   model: 'text-embedding-3-small',
// // //   input: texts,
// // // });

// // // const vectors = embeddingsResponse.data.map((item, i) => ({
// // //   id: records[i]._id,
// // //   values: item.embedding, // ✅ phải là float[]
// // //   metadata: {
// // //     chunk_text: records[i].chunk_text,
// // //     category: records[i].category,
// // //   },
// // // }));

// // // await index.upsert(vectors);
// // // const texts = records
// // //   .map((r, i) => {
// // //     if (!r.values || !r.values.text || typeof r.values.text !== 'string' || r.values.text.trim().length === 0) {
// // //       console.warn(`Bản ghi không hợp lệ tại chỉ số ${i}:`, r);
// // //       return null;
// // //     }
// // //     return r.values.text;
// // //   })
// // //   .filter(text => text !== null);

// // // if (texts.length === 0) {
// // //   throw new Error('Không tìm thấy văn bản hợp lệ trong records');
// // // }

// // // console.log('Số văn bản sẽ nhúng:', texts.length);
// // // console.log('Ví dụ văn bản:', texts.slice(0, 3));

// // // try {
// // //   // Nhúng văn bản
// // //   const embeddingsResponse = await openai.embeddings.create({
// // //     model: 'text-embedding-3-small',
// // //     input: texts,
// // //   });

// // //   // Kiểm tra độ dài phản hồi
// // //   if (embeddingsResponse.data.length !== texts.length) {
// // //     throw new Error(`Không khớp độ dài: nhận ${embeddingsResponse.data.length} nhúng, kỳ vọng ${texts.length}`);
// // //   }

// // //   // Tạo vectors
// // //   const vectors = embeddingsResponse.data.map((item, i) => {
// // //     const record = records[i];
// // //     if (!record.id || !record.values.text || !record.metadata.category) {
// // //       throw new Error(`Bản ghi không hợp lệ tại chỉ số ${i}:`, record);
// // //     }
// // //     return {
// // //       id: record.id,
// // //       values: item.embedding,
// // //       metadata: {
// // //         chunk_text: record.values.text,
// // //         category: record.metadata.category,
// // //       },
// // //     };
// // //   });

// // //   // Tải lên Pinecone
// // //   await index.upsert(vectors);
// // //   console.log('Đã tải thành công vectors lên Pinecone');
// // // } catch (error) {
// // //   console.error('Lỗi:', error);
// // // }


// // Define the query
// const query = 'Tôi bị mệt tim và cơ thể bị mất sức khi ăn mặn thì tôi nên ăn như thế nào?';

// try {
//   // Nhúng truy vấn bằng OpenAI
//   const embeddingResponse = await openai.embeddings.create({
//     model: 'text-embedding-3-small',
//     input: query,
//   });

//   const queryEmbedding = embeddingResponse.data[0].embedding;

//   // Tìm kiếm trong chỉ số Pinecone
//   const results = await index.query({
//     vector: queryEmbedding,
//     topK: 5,
//     includeMetadata: true,
//   });

//   // In kết quả
//   results.matches.forEach(hit => {
//     console.log(
//       `id: ${hit.id}, score: ${hit.score?.toFixed(2)}, category: ${hit.metadata?.category}, text: ${hit.metadata?.chunk_text}`
//     );
//   });
// } catch (error) {
//   console.error('Lỗi:', error);
// }
