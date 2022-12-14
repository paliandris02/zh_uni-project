using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ZH_VBII48.Controllers
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        // összes rendelés
        [HttpGet]
        [Route("orders/")]
        public IActionResult getOrders()
        {
            Models.Zh3Context context = new Models.Zh3Context();
            var orders = from x in context.Orders
                         select x;
            return new JsonResult(orders);
        }

        // rendelés ID alapján
        [HttpGet]
        [Route("orders/{id}")]
        public IActionResult getOrderByID(int id)
        {
            Models.Zh3Context context = new Models.Zh3Context();
            var order = from x in context.Orders
                        where x.OrderId == id
                        select x;
            if(order == null)
            {
                return BadRequest("Nincs ilyen sorszámú rendelés!");
            }
            return new JsonResult(order.FirstOrDefault());
        }

        // rendelés törlése
        [HttpDelete]
        [Route("orders/{id}")]
        public IActionResult deleteOrder(int id)
        {
            Models.Zh3Context context = new Models.Zh3Context();
            var order = from x in context.Orders
                        where x.OrderId == id
                        select x;
            if(order == null)
            {
                return BadRequest("Nincs ilyen sorszámú rendelés!");
            }
            context.Orders.Remove(order.FirstOrDefault());
            context.SaveChanges();
            return Ok("Rendelés törölve.");

        }

        // rendelés hozzáadása
        [HttpPost]
        [Route("orders/")]
        public IActionResult addOrder([FromBody] Models.Order newOrder)
        {
            Models.Zh3Context context = new Models.Zh3Context();
            context.Orders.Add(newOrder);
            context.SaveChanges();
            return Ok("Rendelés hozzáadva!");
        }

        // rendelés szerkesztése
        [HttpPut]
        [Route("orders/{id}")]
        public IActionResult updateOrder(int id, [FromBody] Models.Order updatedOrder)
        {
            Models.Zh3Context context = new Models.Zh3Context();
            var order = (from x in context.Orders
                         where x.OrderId == id
                         select x).FirstOrDefault();
            if (order == null) return BadRequest("Order not found!");

            order.OrderId = updatedOrder.OrderId;
            order.FullName = updatedOrder.FullName;
            order.Avatar = updatedOrder.Avatar;
            order.Email = updatedOrder.Email;
            order.Country = updatedOrder.Country;
            order.Address = updatedOrder.Address;
            order.Date = updatedOrder.Date;
            order.Creditcard = updatedOrder.Creditcard;
            order.Amount = updatedOrder.Amount;

            try
            {
                context.SaveChanges();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok("Order updated!");
        }
    }
}
