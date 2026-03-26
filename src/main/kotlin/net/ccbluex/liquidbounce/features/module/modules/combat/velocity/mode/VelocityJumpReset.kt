/*
 * This file is part of LiquidBounce (https://github.com/CCBlueX/LiquidBounce)
 *
 * Copyright (c) 2015 - 2026 CCBlueX
 *
 * LiquidBounce is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * LiquidBounce is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with LiquidBounce. If not, see <https://www.gnu.org/licenses/>.
 */
package net.ccbluex.liquidbounce.features.module.modules.combat.velocity.mode

import net.ccbluex.liquidbounce.config.types.group.ToggleableValueGroup
import net.ccbluex.liquidbounce.event.events.MovementInputEvent
import net.ccbluex.liquidbounce.event.events.PacketEvent
import net.ccbluex.liquidbounce.event.handler
import net.ccbluex.liquidbounce.features.module.modules.render.ModuleDebug
import net.ccbluex.liquidbounce.utils.entity.hasCooldown
import net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket
import kotlin.random.Random

/**
 * Jump Reset mode. A technique most players use to minimize the amount of knockback they get.
 */
internal object VelocityJumpReset : VelocityMode("JumpReset") {

    private val chance by float("Chance", 100f, 0f..100f, "%")

    private object JumpByReceivedHits : ToggleableValueGroup(this, "JumpByReceivedHits", false) {
        val hitsUntilJump by intRange("HitsUntilJump", 2..2, 0..10)
    }

    private object JumpByDelay : ToggleableValueGroup(this, "JumpByDelay", true) {
        val ticksUntilJump by intRange("UntilJump", 2..2, 0..20, "ticks")
    }

    val jumpAutoSprint by boolean("JumpAutoSprint", false)

    init {
        tree(JumpByReceivedHits)
        tree(JumpByDelay)
    }

    private var limitUntilJump = 0
    private var isFallDamage = false

    private var hitsUntilJump = JumpByReceivedHits.hitsUntilJump.random()
    private var ticksUntilJump = JumpByDelay.ticksUntilJump.random()
    @Suppress("unused")
    private val tickJumpHandler = handler<MovementInputEvent> { event ->
        // To be able to alter velocity when receiving knockback, player must be sprinting.
        if (player.hurtTime == 9 && player.onGround()) {
            val wasShiftKeyDown = event.sneak
            val wasSprintKeyDown = mc.options.keySprint.isDown
            val wasLeftImpulseDown = event.directionalInput.left
            val wasRightImpulseDown = event.directionalInput.right

            val damageSource = player.lastDamageSource
            val msgId = damageSource?.type()?.msgId
            val isDamageTypePlayer = msgId == "player" || msgId == "arrow" || msgId == "mob" ||
                msgId == "trident" || msgId == "fireworks" || msgId == "fireball" ||
                msgId == "thrown" || msgId == "explosion"

               if (!isNoItemHitCooldown() && !isDamageTypePlayer) {
                   return@handler
               }

            if (jumpAutoSprint) {
                if (!player.isSprinting) {
                    event.directionalInput = event.directionalInput.copy(forwards = true)
                    mc.options.keySprint.isDown = true
                }
                event.directionalInput = event.directionalInput.copy(left = false, right = false)
            }

            event.sneak = false
            event.jump = true

            if (jumpAutoSprint) {
                event.sneak = wasShiftKeyDown
                mc.options.keySprint.isDown = wasSprintKeyDown
                event.directionalInput =
                    event.directionalInput.copy(left = wasLeftImpulseDown, right = wasRightImpulseDown)
            }

            updateLimit()


            event.jump = true
        }

        limitUntilJump = 0
    }


    /**
     * Checks if the player has no item hit cooldown, meaning the player is in 1.8-style PvP
     * (no attack cooldown) or the attack speed is high enough that there is effectively no cooldown.
     */
    private fun isNoItemHitCooldown(): Boolean = !player.hasCooldown

    private fun updateLimit() {
        if (JumpByReceivedHits.enabled) {
            if (player.hurtTime == 9) {
                limitUntilJump++
            }
            return
        }

        limitUntilJump++
    }

}
